import styles from "./Home.module.scss";
import Navbar from "../../Components/navbar/navbar"; // <-- Điều chỉnh đường dẫn
import FriendList from "../Friend/FriendList";
import GroupList from "../Group/GroupList"; // <-- Điều chỉnh đường dẫn

const Home = () => {
  return (
    <div className={styles.homePage}>
      <Navbar />
      <div className={styles.card}>
        <aside className={styles.left}>
          <GroupList />
        </aside>
        <main className={styles.middle}>
          <h1>Bảng tin</h1>
          <p>Nội dung chính của bảng tin sẽ hiển thị ở đây.</p>
        </main>
        <aside className={styles.right}>
          <FriendList />
        </aside>
      </div>
    </div>
  );
};
export default Home;