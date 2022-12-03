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
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { UsersBookshelfQueryDto } from './dto/query.dto';
import { GetUser } from './decorator/get-user.decorator';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards';
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
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('/bookshelves/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Bookshelf> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
