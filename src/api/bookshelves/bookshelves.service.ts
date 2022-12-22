import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookshelvesService {
  constructor(private readonly prisma: PrismaService) {}

  async findPopular() {
    const bookshelves = await this.prisma.bookshelf.findMany({
      where: { visible: 'PUBLIC' },
      orderBy: { userForks: { _count: 'desc' } },
      take: 100,
      select: {
        id: true,
        name: true,
        description: true,
        visible: true,
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
