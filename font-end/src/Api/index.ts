// src/api/index.ts - PHIÊN BẢN CUỐI CÙNG SỬ DỤNG STORE

import axios from 'axios';
import { useAuthStore } from '../store/authStore'; // <-- IMPORT STORE VÀO
import type { CreateUserDto, UpdateUserDto } from '../types';
import type { LoginResponse } from '../types/index'; // Giả sử bạn đã định nghĩa LoginResponse trong types/index.ts

const api = axios.create({
  baseURL: 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor này giờ sẽ lấy token từ store
api.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {};
    }
    // Lấy token từ Zustand store
    const token = useAuthStore.getState().token; 
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor này sẽ gọi hàm logout() của store khi có lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Gọi hàm logout từ store để xóa thông tin user và token
      useAuthStore.getState().logout(); 
      window.location.href = '/login'; 
    }
    return Promise.reject(error); 
  }
);


// ========== AUTH ==========
export const login = async ({ email, password }: { email: string; password: string }) => {
  // Chỉ định rõ kiểu dữ liệu trả về cho `api.post` là `LoginResponse`
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  
  // Bây giờ, TypeScript đã biết chắc chắn response.data sẽ có user và access_token
  const { user, access_token } = response.data;
  
  // Đoạn code này giờ đây sẽ không còn báo lỗi
  if (user && access_token) {
    useAuthStore.getState().setUser(user, access_token);
  }

  return response.data;
};

// Các hàm khác không cần thay đổi logic bên trong
export const register = (dto: CreateUserDto) => api.post('/users/register', dto);
export const forgotPassword = (email: string) => api.post('/auth/forgot-password', { email });
export const sendResetPasswordOtp = (email: string) => api.post('/auth/send-otp', { email });
export const verifyOtp = (email: string, otp: string) => api.post('/auth/verify-otp', { email, otp });
export const resetPassword = (email: string, resetToken: string, newPassword: string) => 
  api.post('/auth/reset', { email, resetToken, newPassword });

// ... (Giữ nguyên các hàm API khác: getMyProfile, updateProfile, ...)
// ========== USER & PROFILE ==========
export const getMyProfile = () => api.get('/users/me');
export const updateProfile = (data: UpdateUserDto) => api.patch('/users/me/update', data);

// ========== INTERESTS ==========
export const fetchAllInterests = () => api.get('/interest');
export const saveUserInterests = (interestIds: string[]) => api.post('/users/set/interests', { interestIds });

// ========== POSTS ==========
export const fetchPosts = (page = 1) => api.get(`/post?page=${page}&limit=10`);
export const createPost = (content: string) => api.post('/post', { content });

// ========== GROUPS ==========
export const fetchMyGroups = () => api.get('/group/me');


export default api;