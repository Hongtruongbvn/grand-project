import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomMemberService } from './chatroom-member.service';

describe('ChatroomMemberService', () => {
  let service: ChatroomMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatroomMemberService],
    }).compile();

    service = module.get<ChatroomMemberService>(ChatroomMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
