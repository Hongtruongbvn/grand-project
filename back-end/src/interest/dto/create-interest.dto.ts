// dto/create-interest.dto.ts
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateInterestDto {
  @IsNotEmpty({ message: 'Tên sở thích không được để trống' })
  @IsString({ message: 'Tên sở thích phải là chuỗi' })
  name: string;

  @IsEnum(['game', 'sport', 'music', 'other'], {
    message: 'Loại sở thích phải là game, sport, music hoặc other',
  })
  type: string;
}
