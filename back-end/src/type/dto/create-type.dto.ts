// dto/create-type.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTypeDto {
  @IsNotEmpty({ message: 'Tên loại không được để trống' })
  @IsString({ message: 'Tên loại phải là chuỗi' })
  name: string;

  @IsNumber({}, { message: 'Giá phải là một số' })
  price: number;
}
