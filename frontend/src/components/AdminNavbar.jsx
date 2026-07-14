import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { Menu } from "lucide-react";

const AdminNavbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-colors duration-300">
      <div className="mx-auto px-6 py-3.5 flex items-center justify-between">
        
        {/* Left Side: Mobile Sidebar Trigger & Welcome Message */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
          >
            <Menu size={20} />
          </button>

          {token && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/10">
                {userName ? userName.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-slate-400">Welcome back,</p>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
                  {userName || "Admin"}
                </h2>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Quick Stats / Theme / Logout Actions */}
        <div className="flex items-center gap-3">
          {token && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400">
              <FaUserShield size={13} />
              <span className="text-[11px] font-bold tracking-wider uppercase">
                {role || "ADMIN"}
              </span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-all duration-300 text-slate-700 dark:text-yellow-400"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FaMoon size={16} /> : <FaSun size={16} />}
          </button>

          {/* Logout Button */}
          {token && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/10 text-white font-medium text-xs transition-all duration-300 active:scale-95"
            >
              <FaSignOutAlt size={12} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
