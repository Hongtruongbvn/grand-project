// dto/create-user.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsArray,
  IsDateString,
  IsMongoId,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  @IsString({ message: 'Tên người dùng phải là chuỗi' })
  username: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  password: string;

  @IsOptional()
  xp?: number;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Avatar phải là chuỗi' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Ngày sinh phải đúng định dạng ISO (yyyy-mm-dd)' },
  )
  birthday?: string;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là true hoặc false' })
  status?: boolean;

  @IsOptional()
  @IsMongoId({ message: 'ID vai trò không hợp lệ' })
  global_role_id?: string;

  @IsOptional()
  @IsBoolean({ message: 'Ẩn hồ sơ phải là true hoặc false' })
  hideProfile?: boolean;

  @IsOptional()
  @IsArray({ message: 'Danh sách thông báo phải là mảng' })
  @IsMongoId({ each: true, message: 'ID thông báo không hợp lệ' })
  notification?: string[];

  @IsOptional()
  @IsArray({ message: 'Danh sách loại tài khoản phải là mảng' })
  @IsMongoId({ each: true, message: 'ID loại tài khoản không hợp lệ' })
  type_id?: string[];

  @IsOptional()
  @IsArray({ message: 'Danh sách sở thích phải là mảng' })
  @IsMongoId({ each: true, message: 'ID sở thích không hợp lệ' })
  interest_id?: string[];

  @IsOptional()
  @IsArray({ message: 'Danh sách bạn bè phải là mảng' })
  @IsMongoId({ each: true, message: 'ID bạn bè không hợp lệ' })
  friend_id?: string[];

  @IsOptional()
  @IsArray({ message: 'Danh sách lời mời kết bạn phải là mảng chuỗi' })
  @IsString({ each: true, message: 'Lời mời kết bạn phải là chuỗi' })
  acceptFriend?: string[];

  @IsOptional()
  @IsEnum(['male', 'female', 'other'], {
    message: 'Giới tính phải là male, female hoặc other',
  })
  Gender?: string;
}
