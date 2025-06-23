import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  shortVideo?: string;

  @IsIn(['text', 'video', 'mixed'])
  type: 'text' | 'video' | 'mixed';
}
