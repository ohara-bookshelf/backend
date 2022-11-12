import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookQueryDto } from './dto/books.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: BookQueryDto) {
    console.log(query?.endYear === undefined);
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
}
