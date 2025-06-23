import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @IsMongoId()
  user_id: string;

  title: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsMongoId()
  sender_id?: string;

  @IsOptional()
  @IsMongoId()
  post_id?: string;
}
