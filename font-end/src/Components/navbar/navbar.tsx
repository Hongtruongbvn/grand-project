import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { FaUserFriends } from "react-icons/fa";
import FriendRequests from "../../Pages/Friend/FriendRequests"; // Đường dẫn có thể cần điều chỉnh

interface User {
  username: string;
  avatar?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [showRequests, setShowRequests] = useState(false);
  // ===== STATE MỚI ĐỂ QUẢN LÝ MENU PROFILE =====
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // useEffect để lấy dữ liệu user giữ nguyên...
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:9090/users/friend/request/68500fc6a55d3a5da5cfe832", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const responseData = await res.json();
        const currentUser = responseData.data;
        setUser({ username: currentUser.username, avatar: currentUser.avatar });
        if (currentUser.acceptFriend && Array.isArray(currentUser.acceptFriend)) {
          setRequestCount(currentUser.acceptFriend.length);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };
    fetchUserData();
  }, []);

  // ===== HÀM XỬ LÝ ĐĂNG XUẤT =====
  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem("token");
    // Chuyển hướng người dùng về trang đăng nhập
    navigate("/login");
  };

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

      <div className={styles.navLinks}>
        {/* === KHU VỰC LỜI MỜI KẾT BẠN === */}
        <div className={styles.requestsContainer}>
          <FaUserFriends className={styles.navIcon} onClick={() => setShowRequests(!showRequests)} />
          {requestCount > 0 && (
            <span className={styles.badge}>{requestCount}</span>
          )}
          {showRequests && (
            <div className={styles.requestsDropdown}>
              <FriendRequests />
            </div>
          )}
        </div>

        {/* ===== KHU VỰC PROFILE (ĐÃ CẬP NHẬT) ===== */}
        <div className={styles.profileContainer}>
            <div className={styles.profile} onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <img
                    src={user?.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className={styles.avatar}
                />
                <span>{user?.username || "Profile"}</span>
            </div>

            {/* Menu dropdown cho profile */}
            {showProfileMenu && (
                <div className={styles.profileDropdown}>
                    <div className={styles.dropdownItem} onClick={() => navigate('/profile')}>
                        Xem hồ sơ
                    </div>
                    <div className={styles.dropdownItem} onClick={handleLogout}>
                        Đăng xuất
                    </div>
                </div>
            )}
        </div>
      </div>
    </nav>
  );
}