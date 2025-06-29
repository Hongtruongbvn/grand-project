import { useState } from "react";
// Sửa lại đường dẫn đến file api/index.ts
import { verifyOtp } from "../../../Api";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./VerifyOtp.module.scss";

export default function VerifyOtp() {
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // Logic gọi API đã rất tốt
      const res = await verifyOtp(email, otp);
      const data = res.data as { resetToken: string };
      const resetToken = data.resetToken;

      setSuccess("✅ Xác thực thành công! Đang chuyển hướng...");
      setTimeout(() => {
        navigate("/reset-password", {
          state: { email, token: resetToken },
        });
      }, 2500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "❌ OTP không hợp lệ";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.verifyPage}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h1>Xác thực OTP</h1>
          <p>Nhập mã OTP đã được gửi tới email của bạn để tiếp tục.</p>
        </div>
        <div className={styles.right}>
          {/* Cấu trúc JSX được đưa về như cũ, không còn wrapper */}
          <h2>Nhập mã OTP</h2>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {err && <p className={styles.errorMessage}>{err}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}

            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={loading}
            />

            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              disabled={loading}
            >
              {loading ? "Đang kiểm tra..." : "Xác thực OTP"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
