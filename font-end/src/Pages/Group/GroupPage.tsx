import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './GroupPage.module.scss';
import InviteFriendModal from '../Group/InviteFriendModal';
import { FaArrowLeft, FaUserPlus } from 'react-icons/fa';

interface IGroupDetails {
  _id: string;
  name: string;
  description: string;
  owner: { _id: string; username: string; };
  members: { _id: string; username: string; avatar?: string; }[];
}

export default function GroupPage() {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const [group, setGroup] = useState<IGroupDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);

    const fetchGroupDetails = async () => {
        if (!groupId) return;
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:9090/group/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Không thể tải thông tin nhóm");
            const data = await res.json();
            setGroup(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupDetails();
    }, [groupId]);

    if (loading) return <div className={styles.pageLoader}>Đang tải thông tin nhóm...</div>;
    if (!group) return <div className={styles.pageLoader}>Không tìm thấy nhóm.</div>;

    return (
        <>
            <div className={styles.groupPage}>
                <div className={styles.coverImage}>
                    <button onClick={() => navigate('/home')} className={styles.backButton}><FaArrowLeft /> Về trang chủ</button>
                </div>
                <div className={styles.header}>
                    <h1>{group.name}</h1>
                    <p>{group.description}</p>
                    <button className={styles.inviteButton} onClick={() => setShowInviteModal(true)}>
                        <FaUserPlus /> Mời bạn bè
                    </button>
                </div>
                <div className={styles.content}>
                    <h3>Thành viên ({group.members.length})</h3>
                    <div className={styles.memberList}>
                        {group.members.map(member => (
                            <div key={member._id} className={styles.memberItem}>
                                <img src={member.avatar || '/default-avatar.png'} alt="avatar" />
                                <span>{member.username}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showInviteModal && (
                <InviteFriendModal
                    groupId={group._id}
                    onClose={() => setShowInviteModal(false)}
                />
            )}
        </>
    );
}