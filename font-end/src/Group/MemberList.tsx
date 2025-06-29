// src/Components/group/MemberList.tsx - PHIÊN BẢN HOÀN CHỈNH

import React, { useEffect, useState } from 'react';
import api from '../Api';
import styles from './Group.module.scss'; // Sử dụng file SCSS đã tạo

// Định nghĩa kiểu dữ liệu cho thành viên
interface IMember {
  _id: string;
  username: string;
  avatar?: string;
  online_status?: 'online' | 'offline'; // Backend cần trả về trạng thái này
}

const MemberList: React.FC<{ groupId: string }> = ({ groupId }) => {
    const [members, setMembers] = useState<IMember[]>([]);

    useEffect(() => {
        if (!groupId) return;

        // KẾT NỐI TỚI BE: Gọi API để lấy chi tiết nhóm
        const fetchMembers = async () => {
            try {
                const response = await api.get(`/group/${groupId}`);
                // Lấy mảng members từ response
                const data = response.data as { members?: IMember[] };
                setMembers(data.members || []);
            } catch (error) {
                console.error("Không thể tải danh sách thành viên:", error);
            }
        };
        fetchMembers();
    }, [groupId]);

    // Phân loại thành viên theo trạng thái online/offline
    const onlineMembers = members.filter(m => m.online_status === 'online');
    const offlineMembers = members.filter(m => m.online_status !== 'online');

    return (
        <aside className={styles.memberList}>
            {/* Hiển thị thành viên đang online */}
            {onlineMembers.length > 0 && (
                <div className={styles.memberGroup}>
                    <h4>Online—{onlineMembers.length}</h4>
                    {onlineMembers.map(member => (
                        <div key={member._id} className={styles.memberItem}>
                            <img src={member.avatar || '/default-avatar.png'} alt="avatar" />
                            <span>{member.username}</span>
                            <div className={`${styles.statusDot} ${styles.online}`}></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Hiển thị thành viên đang offline */}
            {offlineMembers.length > 0 && (
                 <div className={styles.memberGroup}>
                    <h4>Offline—{offlineMembers.length}</h4>
                    {offlineMembers.map(member => (
                        <div key={member._id} className={styles.memberItem}>
                            <img src={member.avatar || '/default-avatar.png'} alt="avatar" />
                            <span>{member.username}</span>
                            <div className={`${styles.statusDot} ${styles.offline}`}></div>
                        </div>
                    ))}
                </div>
            )}
        </aside>
    );
};

export default MemberList;