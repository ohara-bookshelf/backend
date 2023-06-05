import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Bookshelf, Forkedshelf, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { UsersBookshelfQueryDto } from './dto/query.dto';
import { UpdateBookshelfDto } from './dto/update-bookshelf.dto';
import { UserDetail } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        bookshelves: {
          where: {
            visible: 'PUBLIC',
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
        },
        _count: {
          select: {
            bookshelves: true,
            forkedshelves: true,
          },
        },
      },
    });

    return {
      ...user,
      _count: {
        ...user._count,
        bookshelves: user.bookshelves.length,
      },
    } as User;
  }

  async getProfile(userId: string): Promise<UserDetail> {
    const data = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        bookshelves: {
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
        },
        forkedshelves: {
          where: {
            bookshelf: { visible: 'PUBLIC' },
          },
          include: {
            bookshelf: {
              include: {
                books: {
                  include: {
                    book: true,
                  },
                },
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

    const totalForks = await this.prisma.forkedshelf.count({
      where: {
        bookshelf: { AND: [{ visible: 'PUBLIC', owner: { id: userId } }] },
      },
    });

    const bookshelves = data.bookshelves.reduce(
      (group, bookshelf) => {
        const { visible } = bookshelf;

        group[visible.toLowerCase()] = group[visible.toLowerCase()] ?? [];
        group[visible.toLowerCase()].push(bookshelf);
        return group;
      },
      {
        public: [],
        private: [],
      },
    );

    return { ...data, totalForks, bookshelves };
  }

  async getPopularUsers(): Promise<User[]> {
    const bookshelves = await this.prisma.bookshelf.findMany({
      orderBy: {
        userForks: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: bookshelves.map((bookshelf) => bookshelf.userId),
        },
      },
      include: {
        bookshelves: {
          where: {
            visible: 'PUBLIC',
          },
        },
        _count: {
          select: {
            bookshelves: true,
            forkedshelves: true,
          },
        },
      },
    });

    return users.map((user) => ({
      ...user,
      _count: {
        ...user._count,
        bookshelves: user.bookshelves.filter((b) => b.visible === 'PUBLIC')
          .length,
      },
    }));
  }

  async createBookshelf(
    createBookshelfDto: CreateBookshelfDto,
    userId: string,
  ) {
    const uniqueBooks = [...new Set(createBookshelfDto.books)];

    return await this.prisma.bookshelf.create({
      data: {
        name: createBookshelfDto.name,
        description: createBookshelfDto.description,
        visible: createBookshelfDto.visible,
        owner: { connect: { id: userId } },
        books: {
          create: uniqueBooks.map((book) => ({
            book: { connect: { id: book } },
          })),
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        visible: true,
        createdAt: true,
        books: {
          select: {
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

  async updateBookshelf(
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

    if (!bookshelf) {
      throw new NotFoundException('Bookshelf not found');
    }

    if (bookshelf.userId !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to edit this bookshelf',
      );
    }

    const updatedBookshelf = await this.prisma.bookshelf.update({
      where: { id: bookshelfId },
      data: {
        name: updateBookshelfDto.name,
        description: updateBookshelfDto.description,
        visible: updateBookshelfDto.visible,
        ...(updateBookshelfDto.books && updateBookshelfDto.books.length > 0
          ? {
              books: {
                upsert: updateBookshelfDto.books.map((bookId) => ({
                  where: {
                    bookshelfId_bookId: {
                      bookId: bookId,
                      bookshelfId: bookshelfId,
                    },
                  },
                  create: {
                    book: { connect: { id: bookId } },
                  },
                  update: {},
                })),
                deleteMany: {
                  bookshelfId: bookshelfId,
                  bookId: {
                    notIn: updateBookshelfDto.books,
                  },
                },
              },
            }
          : {}),
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
        owner: true,
      },
    });

    return updatedBookshelf;
  }

  async deleteBookshelfBooks(
    bookshelfId: string,
    bookId: string,
    userId: string,
  ): Promise<{
    bookshelfId: string;
    bookId: string;
  }> {
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

    await this.prisma.bookshelfBook.delete({
      where: {
        bookshelfId_bookId: {
          bookId,
          bookshelfId,
        },
      },
    });

    return {
      bookshelfId,
      bookId,
    };
  }

  async deleteBookshelf(
    bookshelfId: string,
    userId: string,
  ): Promise<{ bookshelfId: string }> {
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

    await this.prisma.forkedshelf.deleteMany({
      where: {
        bookshelfId: bookshelfId,
      },
    });

    await this.prisma.bookshelf.delete({
      where: {
        id: bookshelfId,
      },
    });

    return { bookshelfId };
  }

  async forkBookshelf(body: { bookshelfId: string }, userId: string) {
    const { bookshelfId } = body;

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
      throw new ForbiddenException('This bookshelf is already forked');
    }

    // * Create new bookshelf
    const newBookshelf = await this.prisma.forkedshelf.create({
      data: {
        bookshelf: {
          connect: {
            id: bookshelfId,
          },
        },
        reader: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        bookshelfId: true,
        bookshelf: {
          select: {
            id: true,
            name: true,
            description: true,
            visible: true,
            createdAt: true,

            books: {
              select: {
                book: true,
              },
            },
            owner: true,
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
        AND: [
          {
            id: forkedshelfId,
            bookshelf: { visible: 'PUBLIC' },
            readerId: userId,
          },
        ],
      },
      include: {
        bookshelf: {
          include: {
            books: {
              include: {
                book: true,
              },
            },
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImgUrl: true,
                _count: {
                  select: {
                    bookshelves: true,
                    forkedshelves: true,
                  },
                },
              },
            },
            userForks: {
              select: {
                reader: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImgUrl: true,
                    _count: {
                      select: {
                        bookshelves: true,
                        forkedshelves: true,
                      },
                    },
                  },
                },
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
