import { useEffect, useState } from "react";
import styles from "./EditProfile.module.scss";
import { useNavigate } from "react-router-dom";

interface EditProfileData {
  username: string;
  avatar?: string;
  bio?: string;
  age?: number;
  interests?: string[];
  location?: string;
  statusMessage?: string;
  website?: string;
}

export default function EditProfile() {
  const [formData, setFormData] = useState<EditProfileData>({
    username: "",
    avatar: "",
    bio: "",
    age: 0,
    interests: [],
    location: "",
    statusMessage: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:9090/users/me/update", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setFormData({
          ...data,
          interests: Array.isArray(data.interests) ? data.interests : [],
        });
      } catch (err) {
        console.error("Lỗi tải hồ sơ:", err);
        setError("Không thể tải hồ sơ");
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      setSuccess("✅ Hồ sơ đã được cập nhật");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      setError("❌ Lỗi khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editProfile}>
      <h2>Chỉnh sửa hồ sơ</h2>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Tên người dùng"
          required
        />
        <input
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="Link ảnh đại diện"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tiểu sử"
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Tuổi"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Vị trí"
        />
        <input
          name="statusMessage"
          value={formData.statusMessage}
          onChange={handleChange}
          placeholder="Trạng thái"
        />
        <input
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="Website cá nhân"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}
