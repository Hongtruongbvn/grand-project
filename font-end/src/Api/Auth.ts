const API = "http://localhost:3000";

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Đăng Nhập thất bại");
  return res.json();
};

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Đăng Ký thất bại");
  return res.json();
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




