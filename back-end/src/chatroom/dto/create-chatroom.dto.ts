import { IsEnum, IsMongoId, IsString } from 'class-validator';

export class CreateChatroomDto {
  @IsString()
  name: string;

  @IsMongoId()
  owner: string;

  @IsEnum(['public', 'private', 'group'])
  type: string;
}
