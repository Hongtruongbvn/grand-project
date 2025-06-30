import React from "react";
import "../Style/AuthFormWrapper.scss";  // Đảm bảo file này tồn tại

interface Props {
  title: string;
  children: React.ReactNode;
  className?: string;  // Thêm prop className để mở rộng style nếu muốn
}

const AuthFormWrapper: React.FC<Props> = ({ title, children, className }) => {
  return (
    <div className={`authLoginWrapper${className ? ` ${className}` : ""}`}>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto">
        <h2 className="authLoginTitle">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthFormWrapper;
