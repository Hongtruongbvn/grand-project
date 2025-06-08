// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import Home from './Pages/Home/Home';
import ProfileUser from './Pages/Profile/ProfileUser';
import ResetPassword from './Pages/ForgotPassword/ResetPassword';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<Home />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Route chính sau khi đăng nhập */}
      <Route path="/" element={<div className="text-center p-10">Welcome to Social App 🚀</div>} />
      <Route path="/profile" element={<ProfileUser />} />
    </Routes>
  );
};

export default App;
