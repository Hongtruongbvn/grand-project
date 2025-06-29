// src/features/auth/Login/Login.tsx - PHIÊN BẢN CUỐI CÙNG (KHÔNG DÙNG WRAPPER)

import { useState } from "react";
import { login } from "../../../Api"; 
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Login.module.scss"; 

// Định nghĩa kiểu cho user trả về từ API
interface UserLoginResponse {
    _id: string;
    interests?: string[];
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // Logic nâng cấp: Gọi hàm login, mọi việc lưu trữ đã được tự động xử lý
      const data = await login({ email: form.email, password: form.password });

      setSuccess("✅ Đăng nhập thành công! Đang chuyển hướng...");

      const user: UserLoginResponse = data.user;
      const hasInterests = user.interests && user.interests.length > 0;

      setTimeout(() => {
        if (hasInterests) {
          navigate("/home");
        } else {
          navigate("/select-interest");
        }
      }, 1500);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "❌ Đăng nhập thất bại";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h1>Kết nối & Giao tiếp</h1>
          <p>Khám phá cộng đồng sống động và đầy cảm hứng!</p>
          <div className={styles.buttonsRegister}>
            <button onClick={() => navigate("/register")}>Tạo tài khoản</button>
          </div>
        </div>
        <div className={styles.right}>
          {/* QUAY LẠI CẤU TRÚC GỐC: 
              Bỏ AuthFormWrapper, đặt form trực tiếp vào đây.
              Thêm H1 cho tiêu đề.
          */}
          <h1>Đăng Nhập</h1>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {err && <p className={styles.errorMessage}>{err}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}
            
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="email"
            />
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="current-password"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </motion.button>

            <div className={styles.links}>
              <span onClick={() => navigate("/forgot-password")}>
                Quên mật khẩu?
              </span>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}