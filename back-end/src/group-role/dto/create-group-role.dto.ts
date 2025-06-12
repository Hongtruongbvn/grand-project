import { IsString, IsNotEmpty, IsMongoId, IsArray } from 'class-validator';

export class CreateGroupRoleDto {
  @IsString()
  @IsNotEmpty({message:"lên là bắt buộc mặc định là member"})
  name: string;

  @IsArray()
  access: string[];

  @IsMongoId()
  group_id: string;

  @IsString()
  color: string;
}
