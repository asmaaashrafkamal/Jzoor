import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa';

const MyProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen pt-[60px] md:pt-[120px] pb-[60px] container mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="sm:text-xl md:text-3xl font-bold text-[#4B5929]">My Profile</h2>
        {/* زر القائمة على الشاشات الصغيرة */}
        <button
          className="md:hidden text-2xl text-[#4B5929]"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      <div className="flex gap-4">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 p-4 bg-white rounded-lg shadow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
