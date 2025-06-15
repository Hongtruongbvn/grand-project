import styles from "./Home.module.scss";
import Navbar from "../../Components/navbar/Navbar";
import FriendList from "../Friend/FriendList";

const Home = () => {
  return (
    <div className={styles.homePage}>
      <Navbar />
      <div className={styles.card}>
        <div className={styles.left}>
          <h1>Group</h1>
          <p>Danh sách nhóm sẽ hiển thị tại đây.</p>
        </div>

        <div className={styles.middle}>
          <h1>Main Feed</h1>
          <p>Nội dung chính của bảng tin sẽ hiển thị ở đây.</p>
        </div>

        <div className={styles.right}>
          <FriendList />
        </div>
      </div>
    </div>
  );
};

export default Home;
