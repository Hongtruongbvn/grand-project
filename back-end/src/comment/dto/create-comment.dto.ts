import { IsNotEmpty, IsOptional, IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsMongoId() // Đảm bảo là ObjectId hợp lệ
  post: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  parentComment?: Types.ObjectId;
}
