import { Test, TestingModule } from '@nestjs/testing';
import { BookshelvesController } from './bookshelves.controller';
import { BookshelvesService } from './bookshelves.service';

describe('BookshelvesController', () => {
  let controller: BookshelvesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookshelvesController],
      providers: [BookshelvesService],
    }).compile();

    controller = module.get<BookshelvesController>(BookshelvesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
