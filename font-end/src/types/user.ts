// src/types/user.ts

/**
 * Dto tương ứng với CreateUserDto ở backend NestJS
 */
export interface CreateUserDto {
  username: string;
  password: string;
  email: string;
  avatar?: string;
  address?: string;
  birthday?: string; // ISO string yyyy-mm-dd
  status?: boolean;
  global_role_id?: string;
  hideProfile?: boolean;
  notification?: string[];
  type_id?: string[];
  interest_id?: string[];
  friend_id?: string[];
  acceptFriend?: string[];
  gender?: 'male' | 'female' | 'other';
}

/**
 * Dto tương ứng với UpdateUserDto ở backend NestJS
 * Các trường đều optional để cập nhật linh hoạt
 */
export interface UpdateUserDto {
  username?: string;
  avatar?: string;
  address?: string;
  birthday?: string;
  status?: boolean;
  hideProfile?: boolean;
  global_role_id?: string;
  notification?: string[];
  type_id?: string[];
  interest_id?: string[];
  friend_id?: string[];
  acceptFriend?: string[];
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  age?: number;
  location?: string;
  statusMessage?: string;
  website?: string;
}