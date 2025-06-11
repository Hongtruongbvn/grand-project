import styles from "./Friend.module.scss";

const Friend = () => {
  return (
    <div className={styles.friendCard}>
      <h3>Friends</h3>
      <ul>
        <li>🧑‍💻 Huy Nguyễn</li>
        <li>👩‍🎨 Trang Lê</li>
        <li>🎮 Minh Khôi</li>
      </ul>
    </div>
  );
};

export default Friend;
