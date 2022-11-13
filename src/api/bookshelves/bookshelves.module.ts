import { Module } from '@nestjs/common';
import { BookshelvesService } from './bookshelves.service';
import { BookshelvesController } from './bookshelves.controller';

@Module({
  controllers: [BookshelvesController],
  providers: [BookshelvesService]
})
export class BookshelvesModule {}
