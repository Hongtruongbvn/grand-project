import { Test, TestingModule } from '@nestjs/testing';
import { VideoCallService } from './video-call.service';

describe('VideoCallService', () => {
  let service: VideoCallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoCallService],
    }).compile();

    service = module.get<VideoCallService>(VideoCallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
