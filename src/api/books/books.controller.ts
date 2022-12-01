import { Controller, Get, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { BookQueryDto } from './dto/books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@Query() query: BookQueryDto) {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }
}
