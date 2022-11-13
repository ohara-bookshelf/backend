import { Test, TestingModule } from '@nestjs/testing';
import { BookshelvesService } from './bookshelves.service';

describe('BookshelvesService', () => {
  let service: BookshelvesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookshelvesService],
    }).compile();

    service = module.get<BookshelvesService>(BookshelvesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
