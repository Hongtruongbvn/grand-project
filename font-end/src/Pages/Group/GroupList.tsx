import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../Style/Widget.module.scss"; // Dùng style chung
import { FaPlus, FaUsers } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import CreateGroup from "../Group/CreateGroup";

interface IGroup {
  _id: string;
  name: string;
  members: string[];
}

export default function GroupList() {
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:9090/group", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải danh sách nhóm");

      const responseData = await res.json();
      const groupsData = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];
      setGroups(groupsData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhóm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className={styles.widget}>
        <div className={styles.header}>
          <h3>
            <FaUsers /> Nhóm
          </h3>
        </div>
        <div className={styles.empty}>
          <AiOutlineLoading3Quarters
            className={`${styles.icon} ${styles.spinner}`}
          />
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.widget}>
        <div className={styles.header}>
          <h3>
            <FaUsers /> Nhóm
          </h3>
          <button
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={12} />
            <span>Tạo nhóm</span>
          </button>
        </div>
        <ul className={styles.list}>
          {groups.length > 0 ? (
            groups.map((group) => (
              <li
                key={group._id}
                className={styles.item}
                onClick={() => navigate(`/group/${group._id}`)}
              >
                <span className={styles.name}>{group.name}</span>
                <span className={styles.meta}>
                  {group.members.length} thành viên
                </span>
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

      {showCreateModal && (
        <CreateGroup
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={fetchGroups}
        />
      )}
    </>
  );
}
