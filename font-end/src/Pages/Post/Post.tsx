import styles from './Post.module.scss';
import type { IPost } from '../Post/PostList'; // Import lại interface

interface PostProps {
    post: IPost;
}

export default function Post({ post }: PostProps) {
    return (
        <div className={styles.post}>
            <div className={styles.header}>
                <img src={post.author.avatar || '/default-avatar.png'} alt="author avatar" />
                <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{post.author.username}</span>
                    <span className={styles.timestamp}>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
            </div>
            <div className={styles.content}>
                <p>{post.content}</p>
            </div>
            {post.media && post.media.length > 0 && (
                <div className={styles.media}>
                    <img src={post.media[0]} alt="Post media" />
                </div>
            )}
            <div className={styles.footer}>
                {/* Nút Like, Comment, Share có thể thêm ở đây */}
            </div>
        </div>
    );
}