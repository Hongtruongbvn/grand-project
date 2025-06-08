import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthFormWrapper from "../../Components/AuthFormWrapper";
import { sendResetPasswordOtp } from "../../Api/Auth";
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
    setSuccess("✅ Mã OTP đã được gửi. Vui lòng kiểm tra email!");
    // Chuyển hướng kèm email dưới dạng query param:
    setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 2000);
  } catch (error: any) {
    setErr(error?.message || "❌ Gửi OTP thất bại. Vui lòng thử lại.");
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthFormWrapper title="Quên mật khẩu?">
      <motion.form
        onSubmit={handleSubmit}
        className={styles.form}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {err && <p className={styles.error}>{err}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="email">Nhập email đã đăng ký</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={loading ? styles.buttonDisabled : styles.button}
        >
          {loading ? "Đang gửi..." : "Gửi mã OTP"}
        </motion.button>
      </motion.form>
    </AuthFormWrapper>
  );
}
