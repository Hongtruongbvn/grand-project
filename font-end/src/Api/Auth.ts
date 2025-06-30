import type { CreateUserDto } from '../types/user';
const API = "http://localhost:9090";

export const register = async (dto: CreateUserDto) => {
  const res = await fetch('http://localhost:9090/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
};

export const login = async ({ email, password }: { email: string; password: string }) => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login failed');

  const data = await res.json();

  // ✅ Lưu token để dùng cho các request cần Authorization
  localStorage.setItem('accessToken', data.access_token);

  // ✅ Lưu userId nếu bạn cần sử dụng sau
  localStorage.setItem('userId', data.user.id); // chú ý là id, không phải _id

  // (Tuỳ chọn) lưu toàn bộ user
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

export const forgotPassword = async (email: string) => {
  const res = await fetch(`${API}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Yêu cầu đặt lại mật khẩu thất bại");
  return res.json();
};

export const sendResetPasswordOtp = async (email: string) => {
  const res = await fetch(`${API}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Gửi OTP thất bại");
  }

  return res.json();
};

export async function resetPassword(email: string, resetToken: string, newPassword: string) {
  const response = await fetch(`${API}/auth/reset`, { // sửa URL đầy đủ
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, resetToken, newPassword }),
  });

  const contentType = response.headers.get('Content-Type') || '';
  const hasJson = contentType.includes('application/json');

  if (!response.ok) {
    if (hasJson) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Reset password failed');
    } else {
      throw new Error('Reset password failed');
    }
  }

  if (hasJson) {
    return response.json();
  }

  return null;
}

export const verifyOtp = async (email: string, otp: string) => {
  const res = await fetch(`${API}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Xác thực OTP thất bại");
  }

  return res.json(); // Thường trả về { resetToken: string }
};




