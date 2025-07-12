import { IsNotEmpty, IsOptional, IsString, IsIn, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  shortVideo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];

  @IsOptional()
  @IsIn(['text', 'video', 'mixed'])
  type?: 'text' | 'video' | 'mixed';

  @IsOptional()
  @IsIn(['public', 'friends', 'private'])
  visibility?: 'public' | 'friends' | 'private';
}
