<<<<<<< Updated upstream
<<<<<<< Updated upstream
export class UpdateUserDto {
  readonly username?: string;
  readonly avatar?: string;
  readonly bio?: string;
  readonly age?: number;
  readonly interests?: string[];
  readonly location?: string;
  readonly statusMessage?: string;
  readonly website?: string;

  
=======

=======
>>>>>>> Stashed changes
import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsObject,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    github?: string;
    tiktok?: string;
  };
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}
