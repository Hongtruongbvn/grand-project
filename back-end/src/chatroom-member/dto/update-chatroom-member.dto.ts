import { PartialType } from '@nestjs/mapped-types';
import { CreateChatroomMemberDto } from './create-chatroom-member.dto';

export class UpdateChatroomMemberDto extends PartialType(CreateChatroomMemberDto) {}
