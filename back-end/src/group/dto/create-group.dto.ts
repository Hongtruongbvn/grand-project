import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty({ message: 'tên group là bắt buộc' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: ' mô tả group là bắt buộc' })
  description: string;

  @IsMongoId()
  owner: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  members?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  interest_id?: string[];
}
