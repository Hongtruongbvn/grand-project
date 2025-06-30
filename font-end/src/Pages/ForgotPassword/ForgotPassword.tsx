import { useState } from "react";
import { sendResetPasswordOtp } from "../../Api/Auth";
import AuthFormWrapper from "../../Components/AuthFormWrapper";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./ForgotPassword.module.scss";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);
    try {
      await sendResetPasswordOtp(email);
      setSuccess("✅ Mã OTP đã được gửi. Vui lòng kiểm tra email.");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } }); // ✅ dùng state thay vì query
      }, 3000);
    } catch (error: any) {
      setErr(error.message || "❌ Gửi OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPage}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h1>Lấy lại mật khẩu</h1>
          <p>
            Chúng tôi sẽ gửi một mã OTP vào email của bạn để đặt lại mật khẩu.
          </p>
          <div className={styles.footerCard}>
            <a href="/login" className={styles.loginButton}>
              Đăng nhập
            </a>
          </div>
        </div>
        <div className={styles.right}>
          <AuthFormWrapper title="Quên mật khẩu">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {err && <p className={styles.errorMessage}>{err}</p>}
              {success && <p className={styles.successMessage}>{success}</p>}

              <input
                type="email"
                placeholder="Email đăng ký"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />

              <motion.button
                type="submit"
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                disabled={loading}
              >
                {loading ? "Đang chuyển tiếp..." : "Gửi mã OTP"}
              </motion.button>
            </motion.form>
          </AuthFormWrapper>
        </div>
      </div>
    </div>
  );
}
