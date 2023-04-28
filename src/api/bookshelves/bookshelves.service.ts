import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BookshelfQueryDto,
  RecommendedBookshelfQueryDto,
} from './dto/bookshelves.dto';
import { parseBookshelfQueryString } from './utils/queryParser';

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

    return this.prisma.bookshelf.findMany({
      where: {
        visible: 'PUBLIC',
        books: {
          some: {
            book: {
              isbn: {
                in: isbnList,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: +count,
      select: {
        id: true,
        name: true,
        description: true,
        visible: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImgUrl: true,
          },
        },
        books: {
          select: {
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
          },
        },
      },
    });
  }
}
