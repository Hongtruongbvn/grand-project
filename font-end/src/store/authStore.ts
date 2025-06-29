// src/store/authStore.ts - FILE MỚI HOÀN CHỈNH

// Cài đặt thư viện: npm install zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // persist giúp tự động lưu state vào localStorage

// Định nghĩa kiểu dữ liệu cho user và state
// Bạn có thể mở rộng IUser với các trường khác nếu cần
interface IUser {
  _id: string;
  user_name: string;
  avatar?: string;
  email: string;
  interests?: string[];
}

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean; // Thêm trạng thái này để dễ dàng kiểm tra đăng nhập
  setUser: (user: IUser, token: string) => void;
  logout: () => void;
}

// tạo store với middleware `persist`
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Giá trị khởi tạo
      user: null,
      token: null,
      isAuthenticated: false,

      // Hàm để cập nhật state sau khi đăng nhập thành công
      setUser: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),

      // Hàm để xóa state khi đăng xuất
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'SocialMediaApp', // Tên của key sẽ được lưu trong localStorage
    }
  )
);