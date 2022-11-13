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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { BookshelvesService } from '../bookshelves/bookshelves.service';
import { UsersBookshelfQueryDto } from './dto/query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-bookshelf')
  createBookshelf(
    @Body() createBookshelfDto: CreateBookshelfDto,
    @GetUser('id') userId,
  ) {
    return this.usersService.createBookshelf(createBookshelfDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/bookshelves')
  findAllUsersBookshelf(
    @Query() query: UsersBookshelfQueryDto,
    @GetUser('id') userId,
  ) {
    return this.usersService.findAllUsersBookshelf(query, userId);
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
