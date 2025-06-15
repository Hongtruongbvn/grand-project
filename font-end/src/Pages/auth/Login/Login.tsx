import { useState } from "react";
import { login } from "../../../Api/Auth";
import AuthFormWrapper from "../../../Components/AuthFormWrapper";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Login.module.scss";

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
    setSuccess("");
    setLoading(true);

    try {
      const data = await login({ email: form.email, password: form.password });

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Lưu full user

      setSuccess("✅ Đăng nhập thành công! Đang chuyển hướng...");

      const hasInterests = data.user.interests && data.user.interests.length > 0;

      setTimeout(() => {
        if (hasInterests) {
          navigate("/home");
        } else {
          navigate("/select-interest");
        }
      }, 3000);
    } catch (error: any) {
      console.error("Login error:", error);
      setErr(error.message || "❌ Đăng nhập thất bại");
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
          <AuthFormWrapper title="Đăng Nhập">
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
                {loading ? "Đang chuyển hướng..." : "Đăng Nhập"}
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
