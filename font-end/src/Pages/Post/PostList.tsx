import { useEffect, useState, useCallback } from 'react';
import Post from '../Post/Post'; // Component con sẽ tạo ở dưới
import styles from './PostList.module.scss'; // Đảm bảo đúng đường dẫn

// Định nghĩa kiểu dữ liệu cho một bài đăng
export interface IPost {
    _id: string;
    content: string;
    media?: string[];
    author: {
        _id: string;
        username: string;
        avatar?: string;
    };
    createdAt: string;
}

export default function PostList() {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:9090/post', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div className={styles.postList}>
            {posts.map(post => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    );
}