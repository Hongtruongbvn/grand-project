import styles from "./Group.module.scss";

const Group = () => {
  return (
    <div className={styles.groupCard}>
      <h3>Groups</h3>
      <ul>
        <li>🌐 React Devs</li>
        <li>🎌 Anime Fans</li>
        <li>⚽ Football Club</li>
      </ul>
    </div>
  );
};

export default Group;
