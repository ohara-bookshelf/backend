import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Bookshelf, Forkedshelf } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { UsersBookshelfQueryDto } from './dto/query.dto';
import { UpdateBookshelfDto } from './dto/update-bookshelf.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        bookshelves: {
          include: {
            books: true,
            _count: {
              select: {
                userForks: true,
                books: true,
              },
            },
          },
        },
        forkedshelves: {
          include: {
            bookshelf: {
              include: {
                books: true,
                owner: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImgUrl: true,
                  },
                },
                _count: {
                  select: {
                    userForks: true,
                    books: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const totalFork = await this.prisma.forkedshelf.count({
      where: {
        bookshelf: { AND: [{ visible: 'PUBLIC', owner: { id: userId } }] },
      },
    });

    return { ...user, totalFork: totalFork };
  }

  async createBookshelf(
    createBookshelfDto: CreateBookshelfDto,
    userId: string,
  ) {
    return await this.prisma.bookshelf.create({
      data: {
        name: createBookshelfDto.name,
        description: createBookshelfDto.description,
        visible: createBookshelfDto.visible,
        owner: { connect: { id: userId } },
        books: {
          create: createBookshelfDto.books.map((book) => ({
            book: { connect: { id: book } },
          })),
        },
      },
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });
  }

  async findAllUsersBookshelf(query: UsersBookshelfQueryDto, userId: string) {
    return await this.prisma.bookshelf.findMany({
      where: {
        visible: query.visible,
        userId: userId,
      },
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });
  }

  async findOneBookshelf(
    bookshelfId: string,
    userId: string,
  ): Promise<Bookshelf> {
    const bookshelf = await this.prisma.bookshelf.findFirst({
      where: {
        AND: [{ id: bookshelfId }, { userId: userId }],
      },
      include: {
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

    if (!bookshelf) {
      throw new NotFoundException('Bookshelf not found');
    }

    return bookshelf;
  }

  async update(
    bookshelfId: string,
    updateBookshelfDto: UpdateBookshelfDto,
    userId: string,
  ): Promise<Bookshelf> {
    // * Check if user can edit bookshelf
    const bookshelf = await this.prisma.bookshelf.findUnique({
      where: {
        id: bookshelfId,
      },
    });

    if (bookshelf.userId !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to edit this bookshelf',
      );
    }

    // TODO : update bookshelf require to delete all books and recreate them
    const updatedBookshelf = await this.prisma.bookshelf.update({
      where: { id: bookshelfId },

      data: {
        ...updateBookshelfDto,
        books: {
          create: updateBookshelfDto.books?.map((book) => ({
            book: { connect: { id: book } },
          })),
        },
      },
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });

    return updatedBookshelf;
  }

  async remove(bookshelfId: string, userId: string): Promise<string> {
    const bookshelf = await this.prisma.bookshelf.findUnique({
      where: {
        id: bookshelfId,
      },
    });

    if (!bookshelf) {
      throw new NotFoundException('Bookshelf not found');
    }

    if (bookshelf.userId !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to delete this bookshelf',
      );
    }

    await this.prisma.bookshelf.delete({
      where: {
        id: bookshelfId,
      },
    });

    return bookshelfId;
  }

  async forkBookshelf(bookshelfId: string, userId: string) {
    const bookshelf = await this.prisma.bookshelf.findFirst({
      where: {
        AND: [{ id: bookshelfId }, { visible: 'PUBLIC' }],
      },
      include: {
        owner: true,
      },
    });

    // * Chekc if bookshelf exist
    if (!bookshelf) {
      throw new NotFoundException('Bookshelf not found');
    }

    // * Check if user is not the owner of the bookshelf
    if (bookshelf.owner.id === userId) {
      throw new UnauthorizedException('You are the owner of this bookshelf');
    }

    // * Check if bookshlef is public
    if (bookshelf.visible === 'PRIVATE') {
      throw new ForbiddenException('This bookshelf is private');
    }

    const isForked = await this.prisma.forkedshelf.findFirst({
      where: {
        AND: [{ bookshelfId: bookshelfId }, { readerId: userId }],
      },
    });

    // * Check if bookshelf is already forked
    if (isForked) {
      throw new UnauthorizedException('This bookshelf is already forked');
    }

    // * Create new bookshelf
    const newBookshelf = await this.prisma.forkedshelf.create({
      data: {
        bookshelf: { connect: { id: bookshelfId } },
        reader: { connect: { id: userId } },
      },
      select: {
        id: true,

        bookshelf: {
          select: {
            id: true,
            name: true,
            description: true,
            visible: true,
            books: {
              select: {
                book: true,
              },
            },
          },
        },
      },
    });

    return newBookshelf;
  }

  async findUserForks(userId: string) {
    return await this.prisma.forkedshelf.findMany({
      where: {
        AND: [{ readerId: userId, bookshelf: { visible: 'PUBLIC' } }],
      },
      include: {
        bookshelf: {
          include: {
            books: {
              include: {
                book: true,
              },
            },
            owner: true,
          },
        },
        reader: true,
      },
    });
  }

  async getUserForkDetail(
    forkedshelfId: string,
    userId: string,
  ): Promise<Forkedshelf> {
    const forkshelf = await this.prisma.forkedshelf.findFirst({
      where: {
        AND: [{ id: forkedshelfId, bookshelf: { visible: 'PUBLIC' } }],
      },
      include: {
        bookshelf: {
          include: {
            books: {
              include: {
                book: true,
              },
            },
            owner: true,
          },
        },
        reader: true,
      },
    });

    if (!forkshelf) {
      throw new NotFoundException('Forkedshelf not found or it is private');
    }

    if (forkshelf.reader.id !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to access this fork',
      );
    }

    if (forkshelf.bookshelf.visible === 'PRIVATE') {
      throw new UnauthorizedException('This bookshelf is private');
    }

    return forkshelf;
  }

  async deleteUserFork(forkedshelfId: string, userId: string) {
    const forkshelf = await this.prisma.forkedshelf.findUnique({
      where: {
        id: forkedshelfId,
      },
    });

    // * Check if forkshelf exist
    if (!forkshelf) {
      throw new NotFoundException('Forkshelf not found');
    }

    // * Check if user is the owner of the forkshelf
    if (forkshelf.readerId !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to delete this forkshelf',
      );
    }

    const deletedForkshelf = await this.prisma.forkedshelf.delete({
      where: {
        id: forkedshelfId,
      },
    });

    return deletedForkshelf.id;
  }
}
