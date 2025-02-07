// src/pages/admin/layout/AdminLayout/index.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  // 登录页面不需要使用Admin布局
  if (location.pathname === '/admin/login') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

export default AdminLayout;