import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookQueryDto, RecommendedBookQueryDto } from './dto/books.dto';
import { Book, Prisma } from '@prisma/client';
import { Meta } from 'src/common/type';
import { MlService } from '../ml/ml.service';
import { Cache } from 'cache-manager';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mlService: MlService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(query: BookQueryDto): Promise<{ data: Book[]; meta: Meta }> {
    const { take, author, publisher, title, page, endYear, startYear } = query;

    const where = {
      title: {
        contains: title,
        mode: Prisma.QueryMode.insensitive,
      },
      author: {
        contains: author,
        mode: Prisma.QueryMode.insensitive,
      },
      publisher: {
        contains: publisher,
        mode: Prisma.QueryMode.insensitive,
      },
      year_of_publication: {
        lte: endYear,
        gte: startYear,
      },
    };

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        take,
      }),

      this.prisma.book.count({
        where,
      }),
    ]);

    return {
      data: books,
      meta: {
        total,
        currentPage: +page,
        take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  findOne(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  async findInIsbnList(isbnList: string[], take = 10) {
    return await this.prisma.book.findMany({
      where: {
        isbn: {
          in: isbnList,
        },
      },
      take,
    });
  }

  async getRecommendedBooks({ isbn, count = 20 }: RecommendedBookQueryDto) {
    if (!isbn) {
      const books = await this.prisma.book.findMany();

      if (!books.length)
        throw new BadRequestException(
          'No isbn provided or no books in the database',
        );

      const maxLength = books.length;
      const randomIndex = Math.floor(Math.random() * maxLength);
      isbn = books[randomIndex].isbn;
    }

    const { books } = await this.mlService.getHybridBooks({ isbn, count });

    return await this.findInIsbnList(books, count);
  }

  async getBookReviews(bookId: string) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) throw new NotFoundException('Book not found');

    const $books = `book-reviews-${book.id}`;
    const cachedReviews = await this.cacheManager.get($books);

    if (cachedReviews) return cachedReviews;

    const reviews = await this.mlService.getBookReviews(book.book_path);

    await this.cacheManager.set($books, reviews);

    return reviews;
  }

  async getBooksByExpression(
    expressionDto: {
      imageString64: string;
      take: number;
    },
    userId: string,
  ): Promise<{ books: Book[]; expression: string; genres: string[] }> {
    const { imageString64, take = 10 } = expressionDto;

    const { emotion } = await this.mlService.detectExpression({
      imageString64,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        expression: emotion,
      },
    });

    const { books: isbnList, genres } =
      await this.mlService.getExpressionBasedRecommendation({
        expression: emotion,
        count: take,
      });

    const books = await this.findInIsbnList(isbnList, take);
    return {
      expression: emotion,
      genres,
      books,
    };
  }
}
