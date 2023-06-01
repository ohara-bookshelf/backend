import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookQueryDto, RecommendedBookQueryDto } from './dto/books.dto';
import { Book, Prisma } from '@prisma/client';
import { EmotionResponse, Meta } from 'src/common/type';

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

  findInIsbnList(isbnList: string[]) {
    return this.prisma.book.findMany({
      where: {
        isbn: {
          in: isbnList,
        },
      },
    });
  }

  async getRecommendedBooks({ isbn, count = 20 }: RecommendedBookQueryDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.ML_API_URL}/hybrid-recommendation`, {
          ISBN: {
            text: isbn,
          },
          NUMBER: {
            count: count,
          },
        })
        .pipe(
          catchError(() => {
            throw 'An error happened!';
          }),
        ),
    );

    if (!data || !data.books)
      throw new BadRequestException('Error when getting recommended books');

    return this.findInIsbnList(data.books);
  }

  async getBooksByExpression(expressionDto: {
    imageString64: string;
    take: number;
  }): Promise<{ books: Book[]; expression: string }> {
    const { imageString64, take = 10 } = expressionDto;

    const { data }: EmotionResponse = await firstValueFrom(
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

    const { data: isbnList }: { data: { books: string[] } } =
      await firstValueFrom(
        this.httpService
          .post(`${process.env.EMOTION_API_URL}/emotion-based-recommend`, {
            emotion: {
              text: data.emotion.toLocaleLowerCase(),
            },
            count: {
              count: 10,
            },
          })
          .pipe(
            catchError(() => {
              throw new BadRequestException('Error when detecting expression');
            }),
          ),
      );

    const books = await this.prisma.book.findMany({
      where: {
        isbn: {
          in: isbnList.books,
        },
      },
      take: +take,
    });

    return {
      books,
      expression: data.emotion,
    };
  }
}
