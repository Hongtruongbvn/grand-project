// src/pages/EditProfile/EditProfile.tsx
import { useEffect, useState } from "react";
import styles from "./EditProfile.module.scss";
import { useNavigate } from "react-router-dom";

// Dữ liệu để hiển thị và gửi đi (khớp với UpdateUserDto và UserSchema)
interface IEditProfileData {
  username: string;
  avatar?: string;
  address?: string;
  birthday?: string; // Sẽ giữ ở định dạng 'YYYY-MM-DD' cho input type="date"
  gender: "male" | "female" | "other";
}

export default function EditProfile() {
  const [formData, setFormData] = useState<IEditProfileData>({
    username: "",
    avatar: "",
    address: "",
    birthday: "",
    gender: "other",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 1. Lấy dữ liệu profile hiện tại để điền vào form
  useEffect(() => {
    const fetchCurrentData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("http://localhost:9090/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response = await res.json();
        if (!res.ok) throw new Error(response.message || "Không thể tải hồ sơ");

        const { username, avatar, address, birthday, gender } = response.data;
        setFormData({
          username,
          avatar: avatar || "",
          address: address || "",
          // Chuyển định dạng birthday về YYYY-MM-DD cho input
          birthday: birthday
            ? new Date(birthday).toISOString().split("T")[0]
            : "",
          gender,
        });
      } catch (err: any) {
        console.error("Lỗi tải hồ sơ:", err);
        setError(err.message || "Không thể tải hồ sơ");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentData();
  }, [navigate]);

  // ***** ĐÃ SỬA LỖI TYPESCRIPT Ở ĐÂY *****
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "gender") {
      // Ép kiểu để TypeScript hiểu đây là một trong các giá trị cho phép
      setFormData((prev) => ({
        ...prev,
        gender: value as "male" | "female" | "other",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 2. Gửi dữ liệu cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Lọc ra các trường rỗng để không gửi lên backend
    // Lọc ra các trường rỗng (null, undefined, '') để không gửi lên backend
    const dataToSubmit = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        // Chỉ thêm vào object mới nếu value có giá trị (không phải rỗng, null, undefined)
        if (value) {
          acc[key as keyof IEditProfileData] = value;
        }
        return acc;
      },
      {} as Partial<IEditProfileData>
    );

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:9090/users/me/update", {
        method: "PATCH", // Backend dùng @Patch
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSubmit),
      });

      const response = await res.json();
      if (!res.ok) throw new Error(response.message || "Cập nhật thất bại");

      setSuccess("✅ Hồ sơ đã được cập nhật thành công!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err: any) {
      setError(`❌ ${err.message}` || "Lỗi khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editProfilePage}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Chỉnh sửa hồ sơ</h2>

        {error && <p className={styles.errorMsg}>{error}</p>}
        {success && <p className={styles.successMsg}>{success}</p>}

        <div className={styles.formGroup}>
          <label htmlFor="username">Tên người dùng</label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="avatar">Link ảnh đại diện</label>
          <input
            id="avatar"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address">Địa chỉ</label>
          <input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Ví dụ: 123 Đường ABC, Quận 1, TPHCM"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="birthday">Ngày sinh</label>
          <input
            id="birthday"
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="gender">Giới tính</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}
