// src/pages/Register/Register.tsx
import { useState } from "react";
import type { CreateUserDto } from "../../../types/user";
import { register } from "../../../Api/Auth";
import AuthFormWrapper from "../../../Components/AuthFormWrapper";
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
    setSuccess("");
    setLoading(true);

    try {
      // Chuyển form thành CreateUserDto
      const res = await register(form as CreateUserDto);
      setSuccess(res.message || "Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      console.error("Register error:", error);
      setErr(error.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.card}>
        {/* Bên trái */}
        <div className={styles.left}>
          <h1>Chào mừng bạn!</h1>
          <p>Tạo tài khoản để khám phá mạng xã hội của chúng tôi.</p>
          <div className={styles.buttonsLogin}>
            <button onClick={() => navigate("/login")}>Đăng nhập</button>
          </div>
        </div>

        {/* Bên phải */}
        <div className={styles.right}>
          <AuthFormWrapper title="Đăng Ký">
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
                autoComplete="username"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email || ""}
                onChange={handleChange}
                required
                autoComplete="email"
              />
              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                value={form.password || ""}
                onChange={handleChange}
                required
                autoComplete="new-password"
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
                {loading ? "Đang đăng ký..." : "Đăng Ký"}
              </motion.button>
            </motion.form>
          </AuthFormWrapper>
        </div>
      </div>
    </div>
  );
}
