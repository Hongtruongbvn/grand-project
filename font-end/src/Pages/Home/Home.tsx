import styles from "./Home.module.scss";
import Navbar from "../../Components/navbar/navbar"; // Đảm bảo đúng đường dẫn
import FriendList from "../Friend/FriendList";
import GroupList from "../Group/GroupList"; // Đảm bảo đúng đường dẫn
import CreatePost from "../Post/CreatePost"; // <-- Import component mới
import PostList from "../Post/PostList";     // <-- Import component mới
import { useState } from "react";

const Home = () => {
  // Hàm này dùng để PostList có thể tự làm mới sau khi có bài đăng mới
  // Ta sẽ dùng một "mẹo" nhỏ là thay đổi một state để kích hoạt re-render
  const [postCount, setPostCount] = useState(0);
  const handlePostCreated = () => {
    setPostCount(prev => prev + 1);
  };

  return (
    <div className={styles.homePage}>
      <Navbar />
      <div className={styles.card}>
        <aside className={styles.left}>
          <GroupList />
        </aside>

        <main className={styles.middle}>
          {/* Thay thế nội dung tĩnh bằng các component thật */}
          <CreatePost onPostCreated={handlePostCreated} />
          <PostList key={postCount} /> {/* Thêm key để re-render khi có bài mới */}
        </main>
        
        <aside className={styles.right}>
          <FriendList />
        </aside>
      </div>
    </div>
  );
};

export default Home;