import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import AdminEventsDashboard from '../../components/AdminEventsDashboard';


const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <div className="p-4 bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[#2C2C2C]">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#FFD200] text-[#2C2C2C] rounded-lg hover:bg-[#FFE566] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <AdminEventsDashboard />
    </div>
  );
};

export default DashboardPage;