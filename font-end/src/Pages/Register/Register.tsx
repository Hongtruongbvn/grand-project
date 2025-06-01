import { useState } from "react";
import { register } from "../../Api/Auth";
import AuthFormWrapper from "../../Components/AuthFormWrapper";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Register.module.scss";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err: any) {
      setErr(err.response?.data?.message || err.message || "Đăng ký thất bại");
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

              <input
                name="username"
                type="text"
                placeholder="Tên người dùng"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
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
              <input
                name="address"
                type="text"
                placeholder="Địa chỉ (không bắt buộc)"
                value={form.address}
                onChange={handleChange}
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? "Đang đăng ký..." : "Đăng Ký"}
              </motion.button>

              <div className={styles.links}>
                <span onClick={() => navigate("/login")}>Đã có tài khoản?</span>
              </div>
            </motion.form>
          </AuthFormWrapper>
        </div>
      </div>
    </div>
  );
}
