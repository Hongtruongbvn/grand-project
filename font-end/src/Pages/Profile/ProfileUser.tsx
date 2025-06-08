import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaEnvelope, FaUserFriends } from "react-icons/fa";
import { MdOutlineCake } from "react-icons/md";
import styles from "./ProfileUser.module.scss";
// import Posts from "../../components/posts/Posts";

interface UserProfile {
  username: string;
  email: string;
  address?: string;
  birthday?: string;
  avatar?: string;
  xp: number;
  friends_id: string[];
  post_id: string[];
}

export default function ProfileUser() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/users/${id}`);
      const data = await res.json();
      setUser(data);
    };
    fetchUser();
  }, [id]);

  if (!user) return <div className={styles.loading}>Đang tải thông tin...</div>;

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
          <p>{user.email}</p>
        </div>

        <div className={styles.infoGrid}>
          {user.address && (
            <div className={styles.infoItem}>
              <FaMapMarkerAlt />
              <span>{user.address}</span>
            </div>
          )}
          {user.birthday && (
            <div className={styles.infoItem}>
              <MdOutlineCake />
              <span>{new Date(user.birthday).toLocaleDateString()}</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <FaUserFriends />
            <span>{user.friends_id.length} bạn bè</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.xpLabel}>XP:</span>
            <span>{user.xp}</span>
          </div>
        </div>

        <div className={styles.postSection}>
          <h3>Bài viết</h3>
          {/* <Posts postIds={user.post_id} /> */}
        </div>
      </div>
    </div>
  );
}
