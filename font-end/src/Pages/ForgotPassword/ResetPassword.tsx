import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import AuthFormWrapper from "../../Components/AuthFormWrapper";
import { verifyOtp, resetPassword } from "../../Api/Auth"; 
import styles from "./ForgotPassword.module.scss";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || ""; // lấy email từ URL, ví dụ /reset-password?email=abc@xyz.com

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
      // 1. Verify OTP để lấy resetToken
      const { resetToken } = await verifyOtp(email, otp);

      // 2. Gọi API reset password với resetToken
      await resetPassword(email, resetToken, newPassword);

      setSuccess("✅ Mật khẩu đã được đặt lại. Chuyển hướng đến trang đăng nhập...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setErr(error?.message || "❌ Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <AuthFormWrapper title="Lỗi"><p>Không tìm thấy email. Vui lòng thực hiện lại bước gửi mã OTP.</p></AuthFormWrapper>
  }

  return (
    <AuthFormWrapper title="Đặt lại mật khẩu">
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
          <label htmlFor="otp">Nhập mã OTP</label>
          <input
            id="otp"
            type="text"
            placeholder="Mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <input
            id="newPassword"
            type="password"
            placeholder="********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          {loading ? "Đang xử lý..." : "Xác nhận đặt lại"}
        </motion.button>
      </motion.form>
    </AuthFormWrapper>
  );
}
