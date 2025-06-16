import { useEffect, useState } from "react";
import styles from "./FriendRequests.module.scss";

interface IRequesterInfo {
  _id: string;
  username: string;
  avatar?: string;
}

export default function FriendRequests() {
  const [requests, setRequests] = useState<IRequesterInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    
    try {
      const meRes = await fetch("http://localhost:9090/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = await meRes.json();
      if (!meRes.ok) throw new Error("Không thể lấy dữ liệu");
      
      const requesterIds = meData.data.acceptFriend || [];

      if (requesterIds.length > 0) {
        const requestDetails = await Promise.all(
          requesterIds.map((id: string) =>
            fetch(`http://localhost:9090/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json())
          )
        );
        const validRequests = requestDetails.filter(res => res.data).map(res => res.data);
        setRequests(validRequests);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (action: 'accept' | 'reject', requesterId: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:9090/users/friend/${action}/${requesterId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(prev => prev.filter(req => req._id !== requesterId));
  };

  if (loading) return <p className={styles.message}>Đang tải...</p>;

  return (
    <div className={styles.friendRequests}>
      <h3>Lời mời kết bạn</h3>
      {requests.length > 0 ? (
        <ul className={styles.list}>
          {requests.map((req) => (
            <li key={req._id} className={styles.requestItem}>
              <div className={styles.userInfo}>
                <img src={req.avatar || '/default-avatar.png'} alt="avatar"/>
                <span>{req.username}</span>
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleAction('accept', req._id)} className={styles.acceptBtn}>Đồng ý</button>
                <button onClick={() => handleAction('reject', req._id)} className={styles.rejectBtn}>Từ chối</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.message}>Không có lời mời mới.</p>
      )}
    </div>
  );
}