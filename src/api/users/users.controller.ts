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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { BookshelvesService } from '../bookshelves/bookshelves.service';
import { UsersBookshelfQueryDto } from './dto/query.dto';
import { GetUser } from './decorator/get-user.decorator';
import { CustomGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create-bookshelf')
  createBookshelf(
    @Body() createBookshelfDto: CreateBookshelfDto,
    @GetUser('id') userId,
  ) {
    return this.usersService.createBookshelf(createBookshelfDto, userId);
  }

  @UseGuards(CustomGuard)
  @Get('/bookshelves')
  findAllUsersBookshelf(
    // @Query() query: UsersBookshelfQueryDto,
    @Req() req: Request,
    // @GetUser('id') userId,
  ) {
    // return this.usersService.findAllUsersBookshelf(query, userId);
    return req.user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
