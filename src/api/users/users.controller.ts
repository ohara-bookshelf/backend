import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { UsersBookshelfQueryDto } from './dto/query.dto';
import { GetUser } from './decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { UpdateBookshelfDto } from './dto/update-bookshelf.dto';
import { Bookshelf } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/bookshelf')
  createBookshelf(
    @Body() createBookshelfDto: CreateBookshelfDto,
    @GetUser('id') userId: string,
  ): Promise<Bookshelf> {
    return this.usersService.createBookshelf(createBookshelfDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/bookshelves')
  findAllUsersBookshelf(
    @Query() query: UsersBookshelfQueryDto,
    @GetUser('id') userId: string,
  ): Promise<Bookshelf[]> {
    return this.usersService.findAllUsersBookshelf(query, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/bookshelves/:id')
  findOne(
    @Param('id') bookshelfId: string,
    @GetUser('id') userId: string,
  ): Promise<Bookshelf> {
    return this.usersService.findOne(bookshelfId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/bookshelves/:id')
  update(
    @Param('id') BookshelfId: string,
    @Body() updateBookshelfDto: UpdateBookshelfDto,
    @GetUser('id') userId: string,
  ): Promise<Bookshelf> {
    return this.usersService.update(BookshelfId, updateBookshelfDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/bookshelves/:id')
  remove(@Param('id') bookshelfId: string, @GetUser('id') userId: string) {
    return this.usersService.remove(bookshelfId, userId);
  }
}
