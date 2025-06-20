import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomMemberController } from './chatroom-member.controller';
import { ChatroomMemberService } from './chatroom-member.service';

describe('ChatroomMemberController', () => {
  let controller: ChatroomMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatroomMemberController],
      providers: [ChatroomMemberService],
    }).compile();

    controller = module.get<ChatroomMemberController>(ChatroomMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
