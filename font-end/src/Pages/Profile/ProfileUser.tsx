import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaGlobe, FaUserAlt } from "react-icons/fa";
import { MdOutlineCake } from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";
import styles from "./ProfileUser.module.scss";

export interface UserProfile {
  username: string;
  avatar?: string;
  bio?: string;
  age?: number;
  interests?: string[];
  location?: string;
  statusMessage?: string;
  website?: string;
}

export default function ProfileUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    console.log("Token lấy từ localStorage:", token);

    try {
      const res = await fetch("http://localhost:3000/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Không thể lấy thông tin người dùng, status: ${res.status}, message: ${errorText}`);
      }

      const data = await res.json();
      setUser({
        ...data,
        interests: Array.isArray(data.interests) ? data.interests : [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (!user) return <div className={styles.error}>Không tìm thấy người dùng</div>;

  return (
    <div className={styles.profileUser}>
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="avatar"
            className={styles.avatar}
          />
          <h2>{user.username}</h2>
          {user.statusMessage && <p className={styles.status}>{user.statusMessage}</p>}
        </div>

        <div className={styles.infoGrid}>
          {user.bio && (
            <div className={styles.infoItem}>
              <FaUserAlt />
              <span>{user.bio}</span>
            </div>
          )}
          {user.location && (
            <div className={styles.infoItem}>
              <FaMapMarkerAlt />
              <span>{user.location}</span>
            </div>
          )}
          {user.age && (
            <div className={styles.infoItem}>
              <MdOutlineCake />
              <span>{user.age} tuổi</span>
            </div>
          )}
          {user.website && (
            <div className={styles.infoItem}>
              <FaGlobe />
              <a href={user.website} target="_blank" rel="noreferrer">
                {user.website}
              </a>
            </div>
          )}
          {Array.isArray(user.interests) && user.interests.length > 0 && (
            <div className={styles.infoItem}>
              <GiThreeFriends />
              <span>Sở thích: {user.interests.join(", ")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
