import { useState } from 'react';
import styles from './CreateGroup.module.scss';

interface CreateGroupProps {
  onClose: () => void;      // Hàm để đóng modal
  onGroupCreated: () => void; // Hàm để làm mới danh sách nhóm sau khi tạo
}

export default function CreateGroup({ onClose, onGroupCreated }: CreateGroupProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      setError('Tên nhóm và mô tả không được để trống.');
      return;
    }
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:9090/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Tạo nhóm thất bại');
      }

      onGroupCreated(); // Gọi hàm để tải lại danh sách nhóm
      onClose(); // Đóng form
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Tạo nhóm mới</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Tên nhóm</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Hội yêu Lập trình"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về nhóm của bạn"
              rows={4}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Hủy
            </button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Đang tạo...' : 'Tạo nhóm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}