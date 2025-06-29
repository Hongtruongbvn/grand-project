// src/Components/layout/MainLayout.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Navbar from '../navbar/navbar';
import GroupSidebar from '../group_sidebar/GroupSidebar'; // <-- ĐẢM BẢO ĐÃ IMPORT
import styles from './MainLayout.module.scss';

const MainLayout: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={styles.appLayout}>
      <GroupSidebar /> {/* <-- VÀ SỬ DỤNG Ở ĐÂY */}
      <div className={styles.mainWrapper}>
        <Navbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;