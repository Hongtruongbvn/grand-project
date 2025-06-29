import { useEffect, useState } from "react";
import { fetchAllInterests, saveUserInterests } from "../../Api/Interest";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./InterestSelection.module.scss";

interface Interest {
  _id: string;
  name: string;
  type: string;
}

export default function InterestSelection() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Nếu đã có sở thích thì chuyển về trang home
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.interests?.length > 0) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const data = await fetchAllInterests();
        setInterests(data);
      } catch (err) {
        console.error("Lỗi tải danh sách sở thích", err);
      }
    };
    loadInterests();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await saveUserInterests(selected);
      setSuccess("✅ Cập nhật thành công!");

      // ✅ cập nhật lại user trong localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.interests = selected
        .map((id) => interests.find((item) => item._id === id))
        .filter(Boolean);
      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (err) {
      console.error("Lỗi gửi sở thích:", err);
      setError("❌ Lưu thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.interestPage}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h1>Sở thích & Cá nhân hóa</h1>
          <p>Giúp chúng tôi đề xuất nội dung phù hợp hơn với bạn.</p>
        </div>
        <div className={styles.right}>
          <motion.div
            className={styles.wrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>🎯 Hãy chọn những sở thích bạn yêu thích</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}

            <div className={styles.grid}>
              {interests.map((interest) => (
                <div
                  key={interest._id}
                  className={`${styles.interestItem} ${
                    selected.includes(interest._id) ? styles.selected : ""
                  }`}
                  onClick={() => toggleSelect(interest._id)}
                >
                  {interest.name}
                  <span className={styles.tag}>{interest.type}</span>
                </div>
              ))}
            </div>
            <motion.button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={loading || selected.length === 0}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Đang lưu..." : "Xác nhận"}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
