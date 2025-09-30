import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
