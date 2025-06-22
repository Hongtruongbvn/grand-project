import { IsMongoId, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsMongoId()
  room_id: string;

  @IsMongoId()
  sender_id: string;
}
