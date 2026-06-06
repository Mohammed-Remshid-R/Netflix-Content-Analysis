import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProfileDrawer from '../components/ProfileDrawer';
import { useDashboard } from '../context/DashboardContext';

function DashboardLayout() {
  const { sidebarCollapsed } = useDashboard();

  return (
    <div className="app-container min-h-screen bg-[#050505] flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace */}
      <div 
        className={`main-workspace flex-1 flex flex-col min-h-screen bg-[#0a0a0a] transition-all duration-300`}
        style={{ marginLeft: sidebarCollapsed ? '0' : '0' }} // Adjust layout dynamically if sidebar is hidden
      >
        {/* Top Header */}
        <Header />

        {/* Page content outlet */}
        <main className="dashboard-main-content flex-grow p-6 md:p-8">
          <Outlet />
        </main>

        {/* Analyst Profile Drawer */}
        <ProfileDrawer />
      </div>
    </div>
  );
}

export default DashboardLayout;
