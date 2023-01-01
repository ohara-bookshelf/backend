import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookQueryDto, RecommendedBookQueryDto } from './dto/books.dto';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(query: BookQueryDto) {
    return await this.prisma.book.findMany({
      where: {
        title: {
          contains: query.title,
        },
        author: {
          contains: query.author,
        },
        publisher: {
          contains: query.publisher,
        },
        year_of_publication: {
          lte: query.endYear !== undefined ? +query.endYear : 9999,
          gte: query.startYear !== undefined ? +query.startYear : 0,
        },
      },
      take: 10,
    });
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
          number: { count: count },
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
}
