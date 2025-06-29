// src/Pages/GroupDetail/GroupDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './GroupDetailPage.module.scss';

// Import các component con mà chúng ta sắp tạo
import ChannelList from '../../chat/ChannelList';
import ChatWindow from '../../chat/ChatWindow';
import MemberList from '../../Group/MemberList';

const GroupDetailPage: React.FC = () => {
  const { groupId, channelId } = useParams<{ groupId: string; channelId: string }>();

  if (!groupId) {
    return <div className={styles.error}>Không tìm thấy ID của nhóm.</div>;
  }

  return (
    <div className={styles.pageLayout}>
      {/* Cột 1: Danh sách kênh */}
      <ChannelList groupId={groupId} activeChannelId={channelId} />

      <div className={styles.mainContent}>
        {/* Cột 2: Cửa sổ chat */}
        {channelId ? 
          <ChatWindow key={channelId} channelId={channelId} /> : 
          <div className={styles.noChannel}>Hãy chọn một kênh để bắt đầu trò chuyện!</div>
        }
        {/* Cột 3: Danh sách thành viên */}
        <MemberList groupId={groupId} />
      </div>
    </div>
  );
};

export default GroupDetailPage;