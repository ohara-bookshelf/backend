import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { HttpModule } from '@nestjs/axios';
import { MlService } from '../ml/ml.service';

@Module({
  imports: [HttpModule],
  controllers: [BooksController],
  providers: [BooksService, MlService],
})
export class BooksModule {}
