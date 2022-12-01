import { Controller, Get, Param } from '@nestjs/common';

import { BookshelvesService } from './bookshelves.service';

@Controller('bookshelves')
export class BookshelvesController {
  constructor(private readonly bookshelvesService: BookshelvesService) {}

  @Get()
  findAll() {
    return this.bookshelvesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookshelvesService.findOne(+id);
  }
}
