// src/Components/chat/ChannelList.tsx - PHIÊN BẢN HOÀN CHỈNH

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../Api';
import styles from './Chat.module.scss'; // Sử dụng file SCSS đã tạo
import { FaHashtag } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

// Định nghĩa kiểu dữ liệu
interface IChannel {
  _id: string;
  name: string;
}

interface Props {
  groupId: string;
  activeChannelId?: string;
}

const ChannelList: React.FC<Props> = ({ groupId, activeChannelId }) => {
  const [groupName, setGroupName] = useState('');
  const [channels, setChannels] = useState<IChannel[]>([]);
  const { user } = useAuthStore(); // Lấy thông tin user để chào mừng

  useEffect(() => {
    if (!groupId) return;

    // KẾT NỐI TỚI BE: Gọi API để lấy chi tiết nhóm
    const fetchGroupData = async () => {
      try {
        const response = await api.get(`/group/${groupId}`);
        const data = response.data as { name: string; channels?: IChannel[] };
        setGroupName(data.name);
        setChannels(data.channels || []); // Backend cần trả về mảng channels
      } catch (error) {
        console.error("Không thể tải thông tin kênh:", error);
      }
    };
    fetchGroupData();
  }, [groupId]); // Gọi lại API mỗi khi groupId thay đổi

  return (
    <aside className={styles.channelList}>
      {/* Header của cột, hiển thị tên nhóm */}
      <header className={styles.channelHeader}>{groupName || 'Đang tải...'}</header>

      {/* Danh sách các kênh chat */}
      <div className={styles.channelContainer}>
        <h5>KÊNH CHAT</h5>
        {channels.map((channel) => (
          <Link
            to={`/channels/${groupId}/${channel._id}`}
            key={channel._id}
            className={`${styles.channelLink} ${channel._id === activeChannelId ? styles.active : ''}`}
          >
            <FaHashtag />
            <span>{channel.name}</span>
          </Link>
        ))}
      </div>
      
      {/* Hiển thị thông tin người dùng ở dưới cùng, giống Discord */}
      <footer className={styles.userPanel}>
          <img src={user?.avatar || '/default-avatar.png'} alt="avatar"/>
          <span>{user?.user_name}</span>
          {/* Có thể thêm các nút setting, mute... ở đây */}
      </footer>
    </aside>
  );
};

export default ChannelList;