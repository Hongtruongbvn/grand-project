
import type { UpdateUserDto } from '../types/user';
const API = 'http://localhost:9090/users';

export const getMyProfile = async (): Promise<any> => {
  const res = await fetch(`${API}/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export const updateProfile = async (data: UpdateUserDto): Promise<any> => {
  const res = await fetch(`${API}/me/update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

export const setInterests = async (ids: string[]): Promise<any> => {
  const res = await fetch(`${API}/set/interests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ interestIds: ids }),
  });
  if (!res.ok) throw new Error('Failed to set interests');
  return res.json();
};