import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BookshelvesService } from './bookshelves.service';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { UpdateBookshelfDto } from './dto/update-bookshelf.dto';

@Controller('bookshelves')
export class BookshelvesController {
  constructor(private readonly bookshelvesService: BookshelvesService) {}

  @Post()
  create(@Body() createBookshelfDto: CreateBookshelfDto, @Req() req: Request) {
    return this.bookshelvesService.create(createBookshelfDto, req);
  }

  @Get()
  findAll(@Req() req: Request) {
    console.log(req.user);
    return this.bookshelvesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookshelvesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookshelfDto: UpdateBookshelfDto,
  ) {
    return this.bookshelvesService.update(+id, updateBookshelfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookshelvesService.remove(+id);
  }
}
