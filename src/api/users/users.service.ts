import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Bookshelf } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { UsersBookshelfQueryDto } from './dto/query.dto';
import { UpdateBookshelfDto } from './dto/update-bookshelf.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
    console.log(userId);
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

  async findOne(bookshelfId: string, userId: string): Promise<Bookshelf> {
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

    const deleteUser = await this.prisma.bookshelf.delete({
      where: {
        id: bookshelfId,
      },
    });

    console.log(deleteUser);

    return bookshelfId;
  }
}
