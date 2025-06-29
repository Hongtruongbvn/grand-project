// src/Components/navbar/navbar.tsx - PHIÊN BẢN HOÀN CHỈNH

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { FaSearch, FaUserFriends, FaBell } from "react-icons/fa"; // Thêm icon chuông

// Import các "vũ khí" mới
import { useAuthStore } from "../../store/authStore";
import api from "../../Api"; 

// Import các component con
import FriendRequests from "../../Friend/FriendRequests"; // Component cũ của bạn
import NotificationDropdown from "../notifications/NotificationDropdown"; // Component mới

// --- Giữ nguyên các Interface của bạn ---
interface ISearchUser {
  _id: string;
  username: string;
  avatar?: string;
}

interface ISearchGroup {
  _id: string;
  name: string;
}

interface ISearchResults {
  users: ISearchUser[];
  groups: ISearchGroup[];
}

const SearchResultsDropdown = ({ results, navigate }: { results: ISearchResults, navigate: any }) => (
    <div className={styles.searchResultsDropdown}>
        {results.users?.length > 0 && <h4>Mọi người</h4>}
        {results.users.map((user) => (
            <div key={user._id} className={styles.resultItem} onMouseDown={() => navigate(`/profile/${user._id}`)}>
                <img src={user.avatar || '/default-avatar.png'} alt="avatar"/>
                <span>{user.username}</span>
            </div>
        ))}
        {results.groups?.length > 0 && <h4>Nhóm</h4>}
        {results.groups.map((group) => (
            <div key={group._id} className={styles.resultItem} onMouseDown={() => navigate(`/group/${group._id}`)}>
                <span>{group.name}</span>
            </div>
        ))}
    </div>
);


export default function Navbar() {
  // Lấy dữ liệu trực tiếp từ store, không cần fetch user nữa
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Các state cho UI
  const [requestCount, setRequestCount] = useState(0);
  const [showRequests, setShowRequests] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // State cho search
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchResults>({ users: [], groups: [] });
  const [showResults, setShowResults] = useState(false);

  // Nâng cấp logic tìm kiếm để dùng api layer
  useEffect(() => {
    if (!query.trim()) {
      setShowResults(false);
      return;
    }
    const debounce = setTimeout(async () => {
      try {
        const response = await api.get(`/search?q=${query}`);
        setResults(response.data as ISearchResults);
        setShowResults(true);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [query]);
  
  // Nâng cấp hàm logout
  const handleLogout = () => {
    logout(); // Chỉ cần gọi hàm từ store, interceptor sẽ tự chuyển hướng
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate("/home")}>🎯 SocialApp</div>
      
      <div className={styles.searchContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Tìm kiếm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        {showResults && <SearchResultsDropdown results={results} navigate={navigate} />}
      </div>
      
      <div className={styles.navLinks}>
        {/* Friend Requests Container */}
        <div className={styles.requestsContainer}>
          <FaUserFriends className={styles.navIcon} onClick={() => setShowRequests(!showRequests)} />
          {requestCount > 0 && <span className={styles.badge}>{requestCount}</span>}
          {showRequests && (
            <div className={styles.requestsDropdown}>
              <FriendRequests />
            </div>
          )}
        </div>
        
        {/* Notification Container - TÍNH NĂNG MỚI */}
        <div className={styles.notificationContainer}>
             <FaBell className={styles.navIcon} onClick={() => setShowNotifications(!showNotifications)} />
             {/* {notificationCount > 0 && <span className={styles.badge}>{notificationCount}</span>} */}
             {showNotifications && <NotificationDropdown />}
        </div>
        
        {/* Profile Container */}
        <div className={styles.profileContainer}>
          <div className={styles.profile} onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img src={user?.avatar || "/default-avatar.png"} alt="avatar" className={styles.avatar}/>
            <span>{user?.user_name || "Profile"}</span>
          </div>
          {showProfileMenu && (
            <div className={styles.profileDropdown}>
              <div className={styles.dropdownItem} onClick={() => navigate(`/profile/${user?._id}`)}>Xem hồ sơ</div>
              <div className={styles.dropdownItem} onClick={handleLogout}>Đăng xuất</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}