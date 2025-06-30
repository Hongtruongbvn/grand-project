// src/pages/ResetPassword/ResetPassword.tsx
import { useState } from "react";
import { resetPassword } from "../../Api/Auth";
import AuthFormWrapper from "../../Components/AuthFormWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./ResetPassword.module.scss";

export default function ResetPassword() {
  const location = useLocation();
  const email = location.state?.email || "";
  const token = location.state?.token || "";
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
      await resetPassword(email, token, newPassword);
      setSuccess("✅ Mật khẩu đã được đặt lại thành công!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      setErr(error.message || "❌ Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetPage}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h1>Đặt lại mật khẩu</h1>
          <p>Hãy tạo một mật khẩu mới mạnh mẽ để bảo vệ tài khoản của bạn.</p>
        </div>
        <div className={styles.right}>
          <AuthFormWrapper title="Đặt lại mật khẩu">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {err && <p className={styles.errorMessage}>{err}</p>}
              {success && <p className={styles.successMessage}>{success}</p>}

              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />

              <motion.button
                type="submit"
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                disabled={loading}
              >
                {loading ? "Đang đặt lại..." : "Xác nhận"}
              </motion.button>
            </motion.form>
          </AuthFormWrapper>
        </div>
      </div>
    </div>
  );
}
