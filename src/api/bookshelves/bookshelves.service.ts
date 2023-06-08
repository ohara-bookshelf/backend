import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BookshelfQueryDto,
  RecommendedBookshelfDto,
  RecommendedBookshelfQueryDto,
} from './dto/bookshelves.dto';
import { parseBookshelfQueryString } from './utils/queryParser';
import { Book, Bookshelf } from '@prisma/client';
import { Meta } from 'src/common/type';
import { MlService } from '../ml/ml.service';
import { MLException } from 'src/exceptions/ml.exception';

@Injectable()
export class BookshelvesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mlService: MlService,
  ) {}

  async findAll(queryString: BookshelfQueryDto): Promise<{
    data: Bookshelf[];
    meta: Meta;
  }> {
    const { take, include, skip } = parseBookshelfQueryString(queryString);

    const [bookshelves, total] = await Promise.all([
      this.prisma.bookshelf.findMany({
        where: { visible: 'PUBLIC' },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include,
      }),
      this.prisma.bookshelf.count({ where: { visible: 'PUBLIC' } }),
    ]);

    const totalPages = Math.ceil(total / take);

    return {
      data: bookshelves,
      meta: {
        total,
        currentPage: +queryString.page,
        take,
        totalPages,
      },
    };
  }

  async findPopular(queryString: BookshelfQueryDto) {
    const { take, include } = parseBookshelfQueryString(queryString);

    const bookshelves = await this.prisma.bookshelf.findMany({
      where: { visible: 'PUBLIC' },
      orderBy: { userForks: { _count: 'desc' } },
      take,
      include,
    });

    return bookshelves;
  }

  async getRecommendedBookshelves({
    isbn,
    count = 20,
  }: RecommendedBookshelfQueryDto) {
    // If no isbn is provided, get a random isbn from the most popular bookshelves
    if (!isbn) {
      const polularBookshelves = await this.findPopular({
        take: count,
        books: true,
      }).then((bookshelves) => {
        return bookshelves.flatMap((bookshelf) =>
          bookshelf.books
            .map((book: { book: Book }) => book.book.isbn)
            .filter((isbn) => isbn !== undefined),
        );
      });

      // If no bookshelves are found, get a random book from the database
      if (!polularBookshelves.length) {
        const books = await this.prisma.book.findMany();

        if (!books.length)
          throw new BadRequestException(
            'No isbn provided or no books in the database',
          );

        const maxLength = books.length;
        const randomIndex = Math.floor(Math.random() * maxLength);
        isbn = books[randomIndex].isbn;
      } else {
        const maxLength = polularBookshelves.length;
        const randomIndex = Math.floor(Math.random() * maxLength);
        isbn = polularBookshelves[randomIndex];
      }
    }

    return await this.mlService.getHybridBookshelfRecommendations({
      isbn,
      count,
    });
  }

  async findOne(bookshelfId: string) {
    return await this.prisma.bookshelf.findUnique({
      where: { id: bookshelfId },
      include: {
        owner: true,
        books: {
          include: {
            book: true,
          },
        },
        _count: {
          select: {
            userForks: true,
            books: true,
          },
        },
      },
    });
  }

  async getBookshelvesByExpression({
    imageString64,
    count,
  }: RecommendedBookshelfDto): Promise<{
    bookshelves: Bookshelf[];
    expression: string;
  }> {
    const { emotion } = await this.mlService.detectExpression({
      imageString64,
    });

    if (!emotion) throw new MLException('Error when detecting expression');

    const { books: isbnList } =
      await this.mlService.getExpressionBasedRecommendation({
        expression: emotion,
        count,
      });

    const bookshelves = await this.prisma.bookshelf.findMany({
      where: {
        books: {
          some: {
            book: {
              isbn: { in: isbnList },
            },
          },
        },
      },
      include: {
        owner: true,
        books: {
          include: {
            book: true,
          },
        },
        _count: {
          select: {
            userForks: true,
            books: true,
          },
        },
      },
      take: count,
    });

    return {
      bookshelves,
      expression: emotion,
    };
  }
}
