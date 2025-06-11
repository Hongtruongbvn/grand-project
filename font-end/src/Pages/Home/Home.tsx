import styles from "./Home.module.scss";
import Group from "../Group/Group";
import Friend from "../Friend/Friend";

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.layout}>
        <div className={styles.leftSidebar}>
          <Group />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.feed}>
            <h2>Main Feed</h2>
            <p>Share moments, thoughts, photos...</p>
            {/* Có thể thêm component như: CreatePost, Stories, PostList */}
          </div>
        </div>

        <div className={styles.rightSidebar}>
          <Friend />
        </div>
      </div>
    </div>
  );
};

export default Home;
