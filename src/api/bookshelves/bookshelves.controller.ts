import { Controller, Get, Param } from '@nestjs/common';

import { BookshelvesService } from './bookshelves.service';

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

  @Get(':id')
  findOne(@Param('id') bookshelfId: string) {
    return this.bookshelvesService.findOne(bookshelfId);
  }
}
