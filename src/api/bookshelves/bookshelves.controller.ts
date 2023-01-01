import { Controller, Get, Param, Query } from '@nestjs/common';

import { BookshelvesService } from './bookshelves.service';
import { RecommendedBookshelfQueryDto } from './dto/bookshelves.dto';

@Controller('bookshelves')
export class BookshelvesController {
  constructor(private readonly bookshelvesService: BookshelvesService) {}

  @Get()
  findAll() {
    return this.bookshelvesService.findAll();
  }

  @Get('popular')
  findPopular() {
    return this.bookshelvesService.findPopular();
  }

  @Get('recommended')
  findRecommended(@Query() query: RecommendedBookshelfQueryDto) {
    return this.bookshelvesService.findRecommended(query);
  }

  @Get(':id')
  findOne(@Param('id') bookshelfId: string) {
    return this.bookshelvesService.findOne(bookshelfId);
  }
}
