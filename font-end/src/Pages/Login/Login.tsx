// src/pages/Login.tsx
import { useState } from "react";
import { login } from "../../Api/Auth";
import AuthFormWrapper from "../../Components/AuthFormWrapper";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Login.module.scss";

export default function Login() {
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: form.emailOrUsername, password: form.password });
      navigate("/");
    } catch (err: any) {
      setErr(err.message || "Đăng nhập thất bại");
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
          <AuthFormWrapper title="Đăng Nhập">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {err && <p className={styles.errorMessage}>{err}</p>}

              <input
                name="emailOrUsername"
                type="text"
                placeholder="Email hoặc Tên người dùng"
                value={form.emailOrUsername}
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Đăng Nhập
              </motion.button>

              <div className={styles.links}>
                <span onClick={() => navigate("/forgot-password")}>
                  Quên mật khẩu?
                </span>
              </div>
            </motion.form>
          </AuthFormWrapper>
        </div>
      </div>
    </div>
  );
}
