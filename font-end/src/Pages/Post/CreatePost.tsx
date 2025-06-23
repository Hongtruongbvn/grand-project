import { useState } from 'react';
import styles from './CreatePost.module.scss';
import { FaImage, FaUserFriends, FaGlobeAmericas, FaLock } from 'react-icons/fa';

// Giả sử có 1 hàm để làm mới danh sách bài đăng
interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const postData: { content: string; privacy: string; media?: string[] } = {
      content,
      privacy,
    };
    
    if (mediaUrl.trim()) {
      postData.media = [mediaUrl.trim()];
    }

    try {
      const res = await fetch('http://localhost:9090/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(postData)
      });

      if (!res.ok) throw new Error('Đăng bài thất bại');
      
      // Reset form và làm mới danh sách
      setContent('');
      setMediaUrl('');
      setPrivacy('public');
      onPostCreated();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createPost}>
      <div className={styles.inputArea}>
        <img src="/default-avatar.png" alt="avatar" className={styles.avatar} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bạn đang nghĩ gì?"
          rows={2}
        />
      </div>
      {mediaUrl && (
          <div className={styles.mediaPreview}>
              <img src={mediaUrl} alt="Media preview" />
          </div>
      )}
      <div className={styles.actions}>
        <div className={styles.attachment}>
            <input 
                type="text" 
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Dán link ảnh vào đây..." 
                className={styles.mediaInput}
            />
            <FaImage size={20} className={styles.actionIcon} />
        </div>
        <div className={styles.rightActions}>
          <div className={styles.privacySelector}>
              {/* Thêm dropdown chọn privacy ở đây nếu muốn */}
          </div>
          <button onClick={handleSubmit} disabled={loading || !content.trim()}>
            {loading ? 'Đang đăng...' : 'Đăng bài'}
          </button>
        </div>
      </div>
    </div>
  );
}