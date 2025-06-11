import { Test, TestingModule } from '@nestjs/testing';
import { InterestController } from './interest.controller';
import { InterestService } from './interest.service';

describe('InterestController', () => {
  let controller: InterestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestController],
      providers: [InterestService],
    }).compile();

    controller = module.get<InterestController>(InterestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
