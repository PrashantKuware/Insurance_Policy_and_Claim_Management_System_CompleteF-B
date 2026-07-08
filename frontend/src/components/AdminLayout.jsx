import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-50 transition-colors duration-300">
      
      {/* SIDEBAR (Responsive drawer on mobile, static on desktop) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* ADMIN NAVBAR */}
        <AdminNavbar onToggleSidebar={() => setSidebarOpen(true)} />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-64px)] bg-slate-50/50 dark:bg-slate-950/50">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;