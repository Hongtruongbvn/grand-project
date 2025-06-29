import React, { useEffect, useState } from 'react';
import api from '../../Api';
import styles from './NotificationDropdown.module.scss';

interface INotification {
    _id: string;
    content: string;
    is_read: boolean;
    createdAt: string;
}

const NotificationDropdown: React.FC = () => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // KẾT NỐI TỚI BE: GET /api/notification/me
        const fetchNotifications = async () => {
            try {
                const response = await api.get('/notification/me');
                setNotifications(response.data as INotification[]);
            } catch (error) {
                console.error("Không thể tải thông báo:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            // KẾT NỐI TỚI BE: PATCH /api/notification/:id/read
            await api.patch(`/notification/${id}/read`);
            setNotifications(prev => 
                prev.map(n => n._id === id ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc:", error);
        }
    };

    return (
        <div className={styles.dropdown}>
            <div className={styles.header}>Thông báo</div>
            <div className={styles.list}>
                {loading && <div className={styles.item}>Đang tải...</div>}
                {!loading && notifications.length === 0 && (
                    <div className={styles.item}>Không có thông báo mới.</div>
                )}
                {notifications.map(noti => (
                    <div 
                        key={noti._id} 
                        className={`${styles.item} ${noti.is_read ? styles.read : ''}`}
                        onClick={() => !noti.is_read && handleMarkAsRead(noti._id)}
                    >
                        <p>{noti.content}</p>
                        <small>{new Date(noti.createdAt).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationDropdown;