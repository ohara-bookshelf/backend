import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { BookshelvesService } from './bookshelves.service';
import {
  BookshelfQueryDto,
  RecommendedBookshelfQueryDto,
} from './dto/bookshelves.dto';

@Controller('bookshelves')
export class BookshelvesController {
  constructor(private readonly bookshelvesService: BookshelvesService) {}

  @Get()
  findAll(@Query() query: BookshelfQueryDto) {
    return this.bookshelvesService.findAll(query);
  }

  @Get('popular')
  findPopular(@Query() query: BookshelfQueryDto) {
    return this.bookshelvesService.findPopular(query);
  }

  @Get('recommended')
  findRecommended(@Query() query: RecommendedBookshelfQueryDto) {
    return this.bookshelvesService.getRecommendedBookshelves(query);
  }

  @Get(':id')
  findOne(@Param('id') bookshelfId: string) {
    return this.bookshelvesService.findOne(bookshelfId);
  }

  @Post('by-expression')
  getBooksByExpression(
    @Body() expressionDto: { imageString64: string; take: number },
  ) {
    return this.bookshelvesService.getBookshelvesByExpression(expressionDto);
  }
}
