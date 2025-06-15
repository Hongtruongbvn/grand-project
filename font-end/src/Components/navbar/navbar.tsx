// src/Components/Navbar/Navbar.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";

interface User {
  username: string;
  avatar?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser({ username: data.username, avatar: data.avatar });
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate("/home")}>
        🎯 SocialApp
      </div>

      <input
        className={styles.searchInput}
        type="text"
        placeholder="Tìm kiếm bạn bè, bài viết..."
      />

      <div className={styles.profile} onClick={() => navigate("/profile")}>
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="avatar"
          className={styles.avatar}
        />
        <span>{user?.username}</span>
      </div>
    </nav>
  );
}
