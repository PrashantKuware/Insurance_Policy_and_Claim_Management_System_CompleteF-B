import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChartPie, FaFolderOpen, FaSignOutAlt } from "react-icons/fa";

const CustomerSidebar = ({ isCollapsed, isMobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/", { replace: true });
  };

  const navItems = [
    { name: "Dashboard", path: "/customerdashboard", icon: FaChartPie },
    { name: "My Claims", path: "/viewallclaim", icon: FaFolderOpen },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between py-5 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-slate-300">
      <div>
        <div className="flex items-center gap-3 px-5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg shadow-lg">
            👤
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-white tracking-tight leading-tight">
                Insurance Pro
              </span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                Customer Portal
              </span>
            </div>
          )}
        </div>

        <div className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="px-3 pt-2 border-t border-slate-800/60">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <FaSignOutAlt className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <aside
      className={`hidden lg:block fixed top-0 bottom-0 left-0 z-30 sidebar-card border-r border-slate-800/50 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {content}
    </aside>
  );
};

export default CustomerSidebar;
