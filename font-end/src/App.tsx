// src/App.tsx - PHIÊN BẢN NÂNG CẤP HOÀN CHỈNH
import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './Components/layout/MainLayout'; // Bố cục chính mới

// Import các trang của bạn
import Login from './features/auth/Login/Login';
import Register from './features/auth/Register/Register';
import Home from './Pages/Home/Home';
import ProfileUser from './Profile/ProfileUser';
import GroupPage from './Group/GroupPage';
import GroupDetailPage from './Pages/Home/GroupDetailPage'; // Trang mới kiểu Discord
import ForgotPassword from './features/auth/ForgotPassword/ForgotPassword';
import ResetPassword from './features/auth/ForgotPassword/ResetPassword';
import VerifyOtp from './features/auth/OTP/VerifyOtp';

const App = () => {
  return (
    <Routes>
      {/* Các trang không cần đăng nhập */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Các trang cần đăng nhập sẽ được bao bọc bởi MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Route mặc định sẽ điều hướng đến /home */}
        <Route index element={<Navigate to="/home" replace />} />
        
        {/* Giao diện Mạng xã hội */}
        <Route path="home" element={<Home />} />
        <Route path="profile/:userId" element={<ProfileUser />} />
        <Route path="group/:groupId" element={<GroupPage />} />
        
        {/* Giao diện Discord */}
        <Route path="channels/:groupId/:channelId" element={<GroupDetailPage />} />
      </Route>
    </Routes>
  );
};

export default App;