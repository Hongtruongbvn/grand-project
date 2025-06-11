// dto/create-global-role.dto.ts
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateGlobalRoleDto {
  @IsNotEmpty({ message: 'Tên vai trò không được để trống' })
  @IsString({ message: 'Tên vai trò phải là chuỗi' })
  name: string;

  @IsArray({ message: 'Danh sách quyền phải là mảng chuỗi' })
  @IsString({ each: true, message: 'Mỗi quyền phải là chuỗi' })
  access: string[];
}
