import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookshelvesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const bookshelves = await this.prisma.bookshelf.findMany({
      where: { visible: 'PUBLIC' },
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

    return bookshelves;
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
