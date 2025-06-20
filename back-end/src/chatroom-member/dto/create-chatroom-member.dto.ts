import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class CreateChatroomMemberDto {
  @IsMongoId()
  chatroom_id: string;

  @IsMongoId()
  user_id: string;

  @IsEnum(['admin', 'member', 'viewer'])
  role: string;

  @IsOptional()
  isActive?: boolean;
}
