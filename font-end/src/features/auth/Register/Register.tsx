// src/features/auth/Register/Register.tsx - LÀM GIỐNG HỆT LOGIN

import { useState } from "react";
import type { CreateUserDto } from "../../../types";
import { register } from "../../../Api"; 
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Register.module.scss";

type FormEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

export default function Register() {
  const [form, setForm] = useState<Partial<CreateUserDto>>({
    username: "",
    email: "",
    password: "",
    gender: undefined,
  });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: FormEvent) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await register(form as CreateUserDto);
      const data = res.data as { message?: string };
      setSuccess(data.message || "Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Đăng ký thất bại";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}> {/* Đổi tên class cho trang */}
      <div className={styles.card}>
        <div className={styles.left}>
          <h1>Chào mừng bạn!</h1>
          <p>Tạo tài khoản để khám phá mạng xã hội của chúng tôi.</p>
          <div className={styles.buttonsLogin}>
            <button onClick={() => navigate("/login")}>Đã có tài khoản?</button>
          </div>
        </div>
        <div className={styles.right}>
          <h1>Đăng Ký</h1>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {err && <p className={styles.errorMessage}>⚠ {err}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}

            <input
              name="username"
              type="text"
              placeholder="Tên người dùng"
              value={form.username || ""}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email || ""}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              value={form.password || ""}
              onChange={handleChange}
              required
            />
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Tạo tài khoản"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}