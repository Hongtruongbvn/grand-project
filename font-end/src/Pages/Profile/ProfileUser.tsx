// src/pages/ProfileUser/ProfileUser.tsx
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaUser, FaBirthdayCake, FaVenusMars } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import styles from "./ProfileUser.module.scss";

// Interface này khớp với dữ liệu backend trả về
interface IUserProfile {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  address?: string;
  birthday?: string; // Backend trả về dạng ISO string
  gender: 'male' | 'female' | 'other';
  interest_id: { _id: string; name: string }[]; // Giả sử interest được populate
  friend_id: string[];
}

// Hàm tiện ích để tính tuổi
const calculateAge = (birthdayString?: string): number | null => {
  if (!birthdayString) return null;
  const birthDate = new Date(birthdayString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function ProfileUser() {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Nếu không có token, chuyển hướng về trang login
        return;
      }
      
      setLoading(true);
      try {
        const res = await fetch("http://localhost:9090/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const response = await res.json();
        // Lấy dữ liệu từ response.data
        setUser(response.data); 
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className={styles.loading}>Đang tải hồ sơ...</div>;
  if (!user) return <div className={styles.error}>Không thể tải thông tin người dùng.</div>;

  const userAge = calculateAge(user.birthday);

  return (
    <div className={styles.profileUserPage}>
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            className={styles.avatar}
          />
          <h2>{user.username}</h2>
          <p className={styles.email}><MdEmail /> {user.email}</p>
          <button className={styles.editBtn} onClick={() => navigate("/edit-profile")}>
            Chỉnh sửa hồ sơ
          </button>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <FaUser />
            <span><strong>Tên người dùng:</strong> {user.username}</span>
          </div>
          {user.address && (
            <div className={styles.infoItem}>
              <FaMapMarkerAlt />
              <span><strong>Địa chỉ:</strong> {user.address}</span>
            </div>
          )}
           {userAge !== null && (
            <div className={styles.infoItem}>
              <FaBirthdayCake />
              <span><strong>Tuổi:</strong> {userAge}</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <FaVenusMars />
            <span><strong>Giới tính:</strong> {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}</span>
          </div>
          {user.interest_id?.length > 0 && (
            <div className={styles.infoItemFull}>
              <GiThreeFriends />
              <strong>Sở thích:</strong>
              <div className={styles.interestTags}>
                {user.interest_id.map((interest) => (
                  <span key={interest._id} className={styles.tag}>{interest.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}