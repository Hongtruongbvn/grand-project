// src/features/auth/AuthFormWrapper.tsx - PHIÊN BẢN LINH HOẠT

import React from 'react';

// Không cần import SCSS ở đây nữa

interface Props {
  title: string;
  children: React.ReactNode;
  // Thêm className để nhận style từ component cha
  className?: string; 
}

const AuthFormWrapper: React.FC<Props> = ({ title, children, className }) => {
  // Áp dụng className được truyền vào
  return (
    <div className={className}> 
      <h1>{title}</h1>
      {children} {/* Thẻ <form> sẽ được render ở đây */}
    </div>
  );
};

export default AuthFormWrapper;