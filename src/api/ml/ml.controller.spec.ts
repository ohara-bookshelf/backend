import { Test, TestingModule } from '@nestjs/testing';
import { MlController } from './ml.controller';
import { MlService } from './ml.service';

describe('MlController', () => {
  let controller: MlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MlController],
      providers: [MlService],
    }).compile();

    controller = module.get<MlController>(MlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
