import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { SidebarProvider } from '../context/SidebarContext';
import { useSidebar } from '../context/SidebarContext';
import Sidebar from '../components/dashboard/Sidebar';
import SettingsMenu from '../components/layout/SettingsMenu';
import GradientLogo from '../components/common/GradientLogo';

function DashboardContent() {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Main content area - adjusted for mobile */}
      <div className={`${isCollapsed ? 'sm:ml-16' : 'sm:ml-64'} transition-all duration-300`}>
        {/* Header - made sticky and mobile responsive */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex justify-between items-center">
          <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-100' : 'opacity-0 invisible sm:visible'}`}>
            <Link to="/dashboard">
              <GradientLogo />
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="bg-gradient-to-r from-accent to-blue-600 text-transparent bg-clip-text font-bold text-sm sm:text-base">
              beta v1
            </span>
            <SettingsMenu />
          </div>
        </div>
        {/* Content area - added padding for mobile */}
        <div className="p-4 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}