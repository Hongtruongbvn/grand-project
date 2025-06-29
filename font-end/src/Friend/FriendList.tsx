import { useEffect, useState } from "react";
import styles from "../Style/Widget.module.scss";
import { FaUsers, FaUsersSlash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface IFriendInfo {
  _id: string;
  username: string;
  avatar?: string;
}

export default function FriendList() {
  const [friends, setFriends] = useState<IFriendInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }

      try {
        const res = await fetch("http://localhost:9090/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const friendIds = data.data.friend_id || [];

        if (friendIds.length > 0) {
          const friendDetails = await Promise.all(
            // Logic này bây giờ đã đúng vì API GET /users/:id đã tồn tại
            friendIds.map((id: string) =>
              fetch(`http://localhost:9090/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              }).then((res) => res.json())
            )
          );
          // Lọc ra các kết quả không thành công và lấy dữ liệu từ .data
          const validFriends = friendDetails
            .filter(response => response && response.data)
            .map(response => response.data);
          setFriends(validFriends);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách bạn bè:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  if (loading) {
    return (
      <div className={styles.widget}>
        <h3><FaUsers /> Bạn bè</h3>
        <div className={styles.empty}>
          <AiOutlineLoading3Quarters className={`${styles.icon} ${styles.spinner}`} />
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <h3><FaUsers /> Bạn bè</h3>
      {friends.length > 0 ? (
        <ul className={styles.list}>
          {friends.map((friend) => (
            <li key={friend._id} className={styles.item}>
              <img src={friend.avatar || '/default-avatar.png'} alt="avatar" className={styles.avatar}/>
              <span className={styles.name}>{friend.username}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <FaUsersSlash className={styles.icon} />
          <span>Chưa có bạn bè nào.</span>
        </div>
      )}
    </div>
  );
}