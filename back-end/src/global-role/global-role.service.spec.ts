import { Test, TestingModule } from '@nestjs/testing';
import { GlobalRoleService } from './global-role.service';

describe('GlobalRoleService', () => {
  let service: GlobalRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalRoleService],
    }).compile();

    service = module.get<GlobalRoleService>(GlobalRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
