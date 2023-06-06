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
import { UserQueryDto, UsersBookshelfQueryDto } from './dto/query.dto';
import { GetUser } from './decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { UpdateBookshelfDto } from './dto/update-bookshelf.dto';
import { Bookshelf, Forkedshelf, User } from '@prisma/client';
import { UserDetail } from './entities/user.entity';
import { Meta } from 'src/common/type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findUsers(
    @Query() query: UserQueryDto,
  ): Promise<{ data: User[]; meta: Meta }> {
    return this.usersService.findUsers(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@GetUser('id') userId: string): Promise<UserDetail> {
    return this.usersService.getProfile(userId);
  }

  @Get('popular')
  getPopularUser(): Promise<User[]> {
    return this.usersService.getPopularUsers();
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string): Promise<User> {
    return this.usersService.getUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bookshelves')
  createBookshelf(
    @Body() createBookshelfDto: CreateBookshelfDto,
    @GetUser('id') userId: string,
  ) {
    return this.usersService.createBookshelf(createBookshelfDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookshelves')
  findAllUsersBookshelf(
    @Query() query: UsersBookshelfQueryDto,
    @GetUser('id') userId: string,
  ): Promise<Bookshelf[]> {
    return this.usersService.findAllUsersBookshelf(query, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('bookshelves/:bookshelfId/books/:bookId')
  deleteBooksInBookshelf(
    @Param('bookshelfId') bookshelfId: string,
    @Param('bookId') bookId: string,
    @GetUser('id') userId: string,
  ): Promise<{
    bookshelfId: string;
    bookId: string;
  }> {
    return this.usersService.deleteBookshelfBooks(bookshelfId, bookId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookshelves/:id')
  findOne(@Param('id') bookshelfId: string, @GetUser('id') userId: string) {
    return this.usersService.findOneBookshelf(bookshelfId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bookshelves/:id')
  updateBookshelf(
    @Param('id') BookshelfId: string,
    @Body() updateBookshelfDto: UpdateBookshelfDto,
    @GetUser('id') userId: string,
  ) {
    return this.usersService.updateBookshelf(
      BookshelfId,
      updateBookshelfDto,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('bookshelves/:id')
  deleteBookshelf(
    @Param('id') bookshelfId: string,
    @GetUser('id') userId: string,
  ): Promise<{ bookshelfId: string }> {
    return this.usersService.deleteBookshelf(bookshelfId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('forkshelves')
  findUserForks(@GetUser('id') userId: string): Promise<Forkedshelf[]> {
    return this.usersService.findUserForks(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('forkshelves/:id')
  getUserForkDetail(
    @Param('id') forkedshelfId: string,
    @GetUser('id') userId: string,
  ): Promise<Forkedshelf> {
    return this.usersService.getUserForkDetail(forkedshelfId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('forkshelves')
  forkBookshelf(
    @Body() body: { bookshelfId: string },
    @GetUser('id') userId: string,
  ) {
    return this.usersService.forkBookshelf(body, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('forkshelves/:id')
  deleteUserFork(
    @Param('id') forkedshelfId: string,
    @GetUser('id') userId: string,
  ): Promise<string> {
    return this.usersService.deleteUserFork(forkedshelfId, userId);
  }
}
