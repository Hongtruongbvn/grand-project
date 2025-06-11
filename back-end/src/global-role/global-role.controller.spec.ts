import { Test, TestingModule } from '@nestjs/testing';
import { GlobalRoleController } from './global-role.controller';
import { GlobalRoleService } from './global-role.service';

describe('GlobalRoleController', () => {
  let controller: GlobalRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalRoleController],
      providers: [GlobalRoleService],
    }).compile();

    controller = module.get<GlobalRoleController>(GlobalRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
