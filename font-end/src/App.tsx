// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/auth/Login/Login';
import Register from './Pages/auth/Register/Register';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import Home from './Pages/Home/Home';
import ProfileUser from './Pages/Profile/ProfileUser';
import ResetPassword from './Pages/ForgotPassword/ResetPassword';
import VerifyOtp from './Pages/OTP/VerifyOtp';
import InterestSelection from './Pages/Interests/SelectInterests';
import EditProfile from './Pages/Profile/EditProfile';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Route chính sau khi đăng nhập */}
      {/* <Route path="/" element={<div className="text-center p-10">Welcome to Social App 🚀</div>} /> */}
      <Route path='/select-interest' element={<InterestSelection />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<ProfileUser />} />
      <Route path="/edit-profile" element={<EditProfile />} />
    </Routes>
  );
};

export default App;
