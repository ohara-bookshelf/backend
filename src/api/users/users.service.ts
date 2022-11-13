import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { UsersBookshelfQueryDto } from './dto/query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  createBookshelf(createBookshelfDto: CreateBookshelfDto, userId: string) {
    console.log('createBookshelfDto', createBookshelfDto);
    return this.prisma.bookshelf.create({
      data: {
        name: createBookshelfDto.name,
        description: createBookshelfDto.description,
        visible: createBookshelfDto.visible,
        createdBy: { connect: { id: userId } },
      },
    });
  }

  findAllUsersBookshelf(query: UsersBookshelfQueryDto, userId: string) {
    return this.prisma.bookshelf.findMany({
      where: {
        userId,
        visible: {
          equals: query.visible,
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
