import { IsNotEmpty, IsOptional, IsString, IsArray, IsIn, IsBoolean } from 'class-validator';

export class CreateGroupPostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];

  @IsOptional()
  @IsString()
  shortVideo?: string;

  @IsOptional()
  @IsIn(['text', 'video', 'mixed'])
  type?: 'text' | 'video' | 'mixed';

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}