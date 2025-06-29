// src/Components/group_sidebar/GroupSidebar.tsx - PHIÊN BẢN HOÀN CHỈNH

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './GroupSidebar.module.scss';
import { FaHome } from 'react-icons/fa';

// Import hàm API đã tạo
import { fetchMyGroups } from '../../Api'; 

// Định nghĩa kiểu dữ liệu cho một nhóm, khớp với response từ BE
interface IGroup {
  _id: string;
  name: string;
  icon?: string;
  channels?: { _id: string; name: string }[]; 
}

const GroupSidebar: React.FC = () => {
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { groupId } = useParams(); // Lấy groupId từ URL để biết icon nào đang active

  useEffect(() => {
    // KẾT NỐI TỚI BE: Gọi API GET /api/group/me
    const loadMyGroups = async () => {
      try {
        setLoading(true);
        const response = await fetchMyGroups();
        setGroups(response.data as IGroup[]);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhóm của bạn:", error);
        // Có thể hiển thị thông báo lỗi cho người dùng ở đây
      } finally {
        setLoading(false);
      }
    };
    loadMyGroups();
  }, []); // Chỉ chạy một lần khi component được tạo

  const handleGroupClick = (group: IGroup) => {
    // Tự động điều hướng người dùng vào kênh chat đầu tiên của nhóm
    // BE cần đảm bảo mảng 'channels' được trả về và có ít nhất 1 phần tử
    const firstChannelId = group.channels?.[0]?._id;

    if (firstChannelId) {
      navigate(`/channels/${group._id}/${firstChannelId}`);
    } else {
      // Nếu nhóm không có kênh nào (trường hợp hiếm), có thể điều hướng đến trang cài đặt nhóm
      console.warn(`Nhóm ${group.name} không có kênh nào.`);
      // Tạm thời điều hướng đến một trang thông báo
      navigate(`/channels/${group._id}/no-channel`);
    }
  };

  return (
    <nav className={styles.sidebar}>
      {/* Nút Home để quay về giao diện Mạng xã hội */}
      <Link 
        to="/home" 
        className={`${styles.iconWrapper} ${!groupId ? styles.active : ''}`} 
        title="Trang chủ"
      >
        <FaHome size={24} />
      </Link>

      <hr className={styles.separator} />

      {/* Hiển thị danh sách các nhóm */}
      {loading ? (
        <div className={styles.iconWrapper}>...</div> // Hiển thị loading
      ) : (
        groups.map((group) => (
          <div
            key={group._id}
            className={`${styles.iconWrapper} ${groupId === group._id ? styles.active : ''}`}
            title={group.name}
            onClick={() => handleGroupClick(group)}
          >
            {/* Hiển thị icon của nhóm hoặc chữ cái đầu tiên */}
            {group.icon ? <img src={group.icon} alt={group.name} /> : <span>{group.name.charAt(0).toUpperCase()}</span>}
          </div>
        ))
      )}
      
      {/* Nút để tạo hoặc tham gia nhóm */}
      <div className={styles.iconWrapper} title="Tạo hoặc tham gia nhóm">
        <span>+</span>
      </div>
    </nav>
  );
};

export default GroupSidebar;