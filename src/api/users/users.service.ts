import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { UsersBookshelfQueryDto } from './dto/query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
