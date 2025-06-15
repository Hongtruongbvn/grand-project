import { useEffect, useState } from "react";
import styles from "./FriendList.module.scss";

interface UserInfo {
  _id: string;
  username: string;
  avatar?: string;
  friend_id?: string[];
  acceptFriend?: string[];
}

export default function FriendList() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<UserInfo[]>([]);
  const [friends, setFriends] = useState<UserInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:9090/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const currentUser = data.data;
      setUser(currentUser);

      if (currentUser.acceptFriend?.length) {
        const reqList = await Promise.all(
          currentUser.acceptFriend.map((email: string) =>
            fetch(`http://localhost:9090/users/find/email?email=${email}`).then((res) =>
              res.json()
            )
          )
        );
        setRequests(reqList.map((r) => r.data));
      }

      if (currentUser.friend_id?.length) {
        const friendList = await Promise.all(
          currentUser.friend_id.map((email: string) =>
            fetch(`http://localhost:9090/users/find/email?email=${email}`).then((res) =>
              res.json()
            )
          )
        );
        setFriends(friendList.map((r) => r.data));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAccept = async (id: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:9090/users/friend/accept/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    location.reload();
  };

  const handleReject = async (id: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:9090/users/friend/reject/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    location.reload();
  };

  return (
    <div className={styles.friendListPage}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Danh sách bạn bè</h2>
        </div>

        <div className={styles.body}>
          {requests.length === 0 && friends.length === 0 ? (
            <p className={styles.empty}>Không có bạn bè hoặc lời mời kết bạn</p>
          ) : (
            <ul className={styles.list}>
              {requests.map((req) => (
                <li key={req._id} className={styles.listItem}>
                  <span>{req.username}</span>
                  <div className={styles.actions}>
                    <button onClick={() => handleAccept(req._id)}>Đồng ý</button>
                    <button onClick={() => handleReject(req._id)}>Từ chối</button>
                  </div>
                </li>
              ))}
              {friends.map((friend) => (
                <li key={friend._id} className={styles.listItem}>
                  <span>{friend.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
