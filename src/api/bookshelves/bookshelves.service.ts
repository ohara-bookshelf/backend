import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BookshelfQueryDto,
  RecommendedBookshelfQueryDto,
} from './dto/bookshelves.dto';
import { parseBookshelfQueryString } from './utils/queryParser';
import { Bookshelf } from '@prisma/client';

@Injectable()
export class BookshelvesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(queryString: BookshelfQueryDto) {
    const { take, include } = parseBookshelfQueryString(queryString);

    const bookshelves = await this.prisma.bookshelf.findMany({
      where: { visible: 'PUBLIC' },
      orderBy: { createdAt: 'desc' },
      take,
      include,
    });

    return bookshelves;
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

  async findRecommended({ title, count }: RecommendedBookshelfQueryDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<{ books: string[] }>(`${process.env.ML_API_URL}/recommend`, {
          title: { text: title },
          number: { count: +count },
        })
        .pipe(
          catchError(() => {
            throw 'An error happened!';
          }),
        ),
    );

    return this.prisma.bookshelf.findMany({
      where: {
        visible: 'PUBLIC',
        books: {
          some: {
            book: {
              isbn: {
                in: data.books,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: +count,
      include: {
        owner: true,
        _count: {
          select: {
            userForks: true,
            books: true,
          },
        },
      },
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

  async getBookshelvesByExpression(expressionDto: {
    imageString64: string;
    take: number;
  }): Promise<{ bookshelves: Bookshelf[]; expression: string }> {
    const { imageString64, take = 10 } = expressionDto;
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.EXPRESSION_API_URL}/process_image`, {
          image: imageString64,
        })
        .pipe(
          catchError((error) => {
            throw new BadRequestException('Error when detecting expression');
          }),
        ),
    );

    const bookshelves = await this.prisma.bookshelf.findMany({
      where: {
        name: {
          contains: data,
          mode: 'insensitive',
        },
      },
      take: +take,
    });

    return {
      bookshelves,
      expression: data,
    };
  }
}
