import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookQueryDto, RecommendedBookQueryDto } from './dto/books.dto';
import { Book, Prisma } from '@prisma/client';
import { Meta } from 'src/common/type';
import { MlService } from '../ml/ml.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mlService: MlService,
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

  async getBooksByExpression(expressionDto: {
    imageString64: string;
    take: number;
  }): Promise<{ books: Book[]; expression: string }> {
    const { imageString64, take = 10 } = expressionDto;

    const { emotion } = await this.mlService.detectExpression({
      imageString64,
    });

    const { books: isbnList } =
      await this.mlService.getExpressionBasedRecommendation({
        expression: emotion,
        count: take,
      });

    const books = await this.findInIsbnList(isbnList, take);

    return {
      books,
      expression: emotion,
    };
  }
}
