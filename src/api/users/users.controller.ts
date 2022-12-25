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
import { Bookshelf, Forkedshelf } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@GetUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

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

  @UseGuards(JwtAuthGuard)
  @Post('/bookshelves/:bookshelfId/fork')
  forkBookshelf(
    @Param('id') bookshelfId: string,
    @GetUser('id') userId: string,
  ) {
    return this.usersService.forkBookshelf(bookshelfId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/forks')
  findUserForks(@GetUser('id') userId: string): Promise<Forkedshelf[]> {
    return this.usersService.findUserForks(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/forks/:id')
  getUserForkDetail(
    @Param('id') forkedshelfId: string,
    @GetUser('id') userId: string,
  ): Promise<Forkedshelf> {
    return this.usersService.getUserForkDetail(forkedshelfId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/forks/:id')
  deleteUserFork(
    @Param('id') forkedshelfId: string,
    @GetUser('id') userId: string,
  ): Promise<string> {
    return this.usersService.deleteUserFork(forkedshelfId, userId);
  }
}
