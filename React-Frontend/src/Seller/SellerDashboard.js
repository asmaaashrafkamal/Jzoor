import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SellerHeader from './SellerHeader';
import SellerSidebar from './SellerSidebar';

const SellerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex relative">
      {/* خلفية رمادية شفافة */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* المحتوى الرئيسي */}
      <div className="flex-1">
                <div className=" md:pl-64 fixed top-0 left-0 right-0 z-40 bg-white shadow">
        
        <SellerHeader setSidebarOpen={setSidebarOpen} />
        </div>
        
                {/* Outlet مع padding top يعادل ارتفاع الهيدر */}
                <div className="pt-16 md:pt-[74px] "> {/* pt-16 = 64px تقريبًا */}
                  <Outlet />
                </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
