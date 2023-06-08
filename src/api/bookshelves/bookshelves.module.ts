import { Module } from '@nestjs/common';
import { BookshelvesService } from './bookshelves.service';
import { BookshelvesController } from './bookshelves.controller';
import { HttpModule } from '@nestjs/axios';
import { MlService } from '../ml/ml.service';

@Module({
  imports: [HttpModule],
  controllers: [BookshelvesController],
  providers: [BookshelvesService, MlService],
})
export class BookshelvesModule {}
