const API = "http://localhost:3000";

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Đăng Nhập thất bại");
  return res.json();
};

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Đăng Ký thất bại");
  return res.json();
};
