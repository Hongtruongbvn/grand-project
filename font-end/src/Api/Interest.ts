const API = "http://localhost:9090";

export const fetchAllInterests = async () => {
  const res = await fetch(`${API}/interest`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error('Failed to fetch interests');
  return res.json();
};

export const saveUserInterests = async (interests: string[]) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API}/users/set/interests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ interestIds: interests }), // 👈 Đúng theo backend
  });

  if (!res.ok) throw new Error('Failed to save interests');
  return res.json();
};


