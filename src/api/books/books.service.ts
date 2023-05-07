import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookQueryDto, RecommendedBookQueryDto } from './dto/books.dto';
import { Book, Prisma } from '@prisma/client';
import { Meta } from 'src/common/type';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
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

  async getRecommendedBooks({ title, count = 20 }: RecommendedBookQueryDto) {
    let isbnList: string[] = [];

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.ML_API_URL}/recommend`, {
          title: { text: title },
          number: { count: +count },
        })
        .pipe(
          catchError(() => {
            throw 'An error happened!';
          }),
        ),
    );

    isbnList = data.books;

    return this.prisma.book.findMany({
      where: {
        isbn: {
          in: isbnList,
        },
      },
    });
  }

  async getBooksByExpression(expressionDto: {
    imageString64: string;
    take: number;
  }): Promise<{ books: Book[]; expression: string }> {
    const { imageString64, take = 10 } = expressionDto;
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.EXPRESSION_API_URL}/process_image`, {
          image: imageString64,
        })
        .pipe(
          catchError(() => {
            throw new BadRequestException('Error when detecting expression');
          }),
        ),
    );

    const books = await this.prisma.book.findMany({
      where: {
        title: {
          contains: data,
          mode: 'insensitive',
        },
      },
      take: +take,
    });

    return {
      books,
      expression: data,
    };
  }
}
