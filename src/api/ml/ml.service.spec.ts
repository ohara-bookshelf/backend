import { Test, TestingModule } from '@nestjs/testing';
import { MlService } from './ml.service';

describe('MlService', () => {
  let service: MlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MlService],
    }).compile();

    service = module.get<MlService>(MlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
