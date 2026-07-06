import React, { useState } from "react";
import AgentSidebar from "./AgentSidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AgentLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex page-background text-slate-800 dark:text-slate-100">
      <AgentSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        } ml-0`}
      >
        <Navbar
          isCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />
        <main className="flex-1 relative z-10 w-full">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AgentLayout;
