import { useEffect, useState } from "react";
import styles from "../../Style/Widget.module.scss"; // File này dùng chung style với FriendList
import { FaUsers } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface IGroup {
  _id: string;
  name: string;
  members: string[];
}

export default function GroupList() {
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }

      try {
        const res = await fetch("http://localhost:9090/group", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể tải danh sách nhóm");
        const data = await res.json();
        setGroups(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhóm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) {
    return (
      // Thay đổi: Dùng class .widget
      <div className={styles.widget}>
        <h3><FaUsers /> Nhóm</h3>
        <div className={styles.empty}>
          <AiOutlineLoading3Quarters className={`${styles.icon} ${styles.spinner}`} />
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    // Thay đổi: Dùng class .widget
    <div className={styles.widget}>
      <h3><FaUsers /> Nhóm</h3>
      <ul className={styles.list}>
        {groups.length > 0 ? (
          groups.map((group) => (
            // Thay đổi: Dùng class .item
            <li key={group._id} className={styles.item}>
              {/* Thay đổi: Dùng các class con .name và .meta */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={styles.name}>{group.name}</span>
                <span className={styles.meta}>{group.members.length} thành viên</span>
              </div>
            </li>
          ))
        ) : (
          <div className={styles.empty}>
            <FaUsers className={styles.icon} />
            <span>Chưa có nhóm nào.</span>
          </div>
        )}
      </ul>
    </div>
  );
}