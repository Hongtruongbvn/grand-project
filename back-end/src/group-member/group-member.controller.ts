import { Controller } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';

@Controller('member')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}
}
