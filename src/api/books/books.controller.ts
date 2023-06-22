import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Book } from '@prisma/client';
import { BooksService } from './books.service';
import {
  BookBySentimentDto,
  BookQueryDto,
  RecommendedBookQueryDto,
} from './dto/books.dto';
import { Meta } from 'src/common/type';
import { GetUser } from '../users/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { SENTIMENT } from '../ml/types/ml.types';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@Query() query: BookQueryDto): Promise<{ data: Book[]; meta: Meta }> {
    return this.booksService.findAll(query);
  }

  @Get('recommended')
  getRecommendedBooks(@Query() query: RecommendedBookQueryDto) {
    return this.booksService.getRecommendedBooks(query);
  }

  @Get('by-sentiment')
  getBooksBySentiment(@Query() query: BookBySentimentDto) {
    return this.booksService.getBooksBySentiment(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Get(':bookId/reviews')
  getBookReviews(@Param('bookId') bookId: string) {
    return this.booksService.getBookReviews(bookId);
  }

  @Get(':bookId/sentiment')
  getBookSentiment(@Param('bookId') bookId: string) {
    return this.booksService.getBookSentiment(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('by-expression')
  getBooksByExpression(
    @Body() expressionDto: { imageString64: string; take: number },
    @GetUser('id') userId: string,
  ) {
    return this.booksService.getBooksByExpression(expressionDto, userId);
  }
}
