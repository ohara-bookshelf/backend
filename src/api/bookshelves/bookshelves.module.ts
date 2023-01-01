import { Module } from '@nestjs/common';
import { BookshelvesService } from './bookshelves.service';
import { BookshelvesController } from './bookshelves.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BookshelvesController],
  providers: [BookshelvesService],
})
export class BookshelvesModule {}
