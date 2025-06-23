import { useEffect, useState } from 'react';
import styles from './InviteFriendModal.module.scss';

interface IFriendInfo {
  _id: string;
  username: string;
  avatar?: string;
}

interface InviteFriendModalProps {
  groupId: string;
  onClose: () => void;
}

export default function InviteFriendModal({ groupId, onClose }: InviteFriendModalProps) {
  const [friends, setFriends] = useState<IFriendInfo[]>([]);
  const [invited, setInvited] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:9090/users/me", { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            const friendIds = data.data.friend_id || [];
            if (friendIds.length > 0) {
                const friendDetails = await Promise.all(
                    friendIds.map((id: string) => fetch(`http://localhost:9090/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()))
                );
                setFriends(friendDetails.filter(r => r.data).map(r => r.data));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchFriends();
  }, []);

  const handleInvite = async (friendId: string) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:9090/group/add-member/${friendId}/${groupId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
    });
    setInvited(prev => [...prev, friendId]);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Mời bạn bè vào nhóm</h3>
        {loading ? <p>Đang tải danh sách bạn bè...</p> : (
            <ul className={styles.friendList}>
                {friends.map(friend => (
                    <li key={friend._id}>
                        <div className={styles.userInfo}>
                            <img src={friend.avatar || '/default-avatar.png'} alt="avatar"/>
                            <span>{friend.username}</span>
                        </div>
                        <button 
                            onClick={() => handleInvite(friend._id)} 
                            disabled={invited.includes(friend._id)}
                            className={invited.includes(friend._id) ? styles.invitedBtn : styles.inviteBtn}>
                            {invited.includes(friend._id) ? 'Đã mời' : 'Mời'}
                        </button>
                    </li>
                ))}
            </ul>
        )}
      </div>
    </div>
  );
}