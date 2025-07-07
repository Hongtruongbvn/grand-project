import { IsString, IsNotEmpty, IsMongoId, IsArray, IsOptional } from 'class-validator';

export class CreateGroupRoleDto {
  @IsString()
  @IsNotEmpty({ message: "Tên vai trò là bắt buộc" })
  name: string;

  @IsArray()
  @IsOptional()
  access?: string[];

  // === SỬA LỖI Ở ĐÂY: Thêm @IsOptional() ===
  // Vai trò chung (global) như 'owner' sẽ không có group_id
  @IsMongoId()
  @IsOptional()
  group_id?: string;

  @IsString()
  @IsOptional()
  color?: string;
}