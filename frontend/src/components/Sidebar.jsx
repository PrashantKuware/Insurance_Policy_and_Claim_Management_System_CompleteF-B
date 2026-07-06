import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartPie,
  FaShieldAlt,
  FaPlusCircle,
  FaUsers,
  FaUserPlus,
  FaFolderOpen,
  FaChartBar,
  FaSignOutAlt,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

const Sidebar = ({ isCollapsed, isMobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState({});

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/", { replace: true });
    onCloseMobile?.();
  };

  const toggleGroup = (groupName) => {
    if (isCollapsed) return;
    setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const navGroups = [
    {
      group: "Core",
      items: [{ name: "Dashboard", path: "/admindashboard", icon: FaChartPie }],
    },
    {
      group: "Products",
      items: [
        { name: "All Products", path: "/allProducts", icon: FaShieldAlt },
        { name: "Add Product", path: "/addProduct", icon: FaPlusCircle },
      ],
    },
    {
      group: "Users",
      items: [
        { name: "All Customers", path: "/allCustomers", icon: FaUsers },
        { name: "All Agents", path: "/allAgents", icon: FaUsers },
        { name: "Add Agent", path: "/addagent", icon: FaUserPlus },
      ],
    },
    {
      group: "Claims & Reports",
      items: [
        { name: "Claims Review", path: "/viewallclaim", icon: FaFolderOpen },
        { name: "Reports", path: "/admindashboard?section=reports", icon: FaChartBar },
      ],
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-5 bg-gradient-to-b from-[#0b1220] via-[#0d1528] to-[#080d1a]">
      <div>
        <div className="flex items-center justify-between px-5 mb-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg flex-shrink-0 shadow-lg shadow-blue-500/20">
              🛡️
            </div>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <span className="font-extrabold text-base text-white tracking-tight leading-tight">
                  Insurance Pro
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Enterprise Admin
                </span>
              </motion.div>
            )}
          </div>
          {isMobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden icon-button text-slate-400 hover:text-white"
              aria-label="Close menu"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="px-3 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {navGroups.map((group) => {
            const isOpen = openGroups[group.group] !== false;

            return (
              <div key={group.group} className="space-y-1">
                {!isCollapsed && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.group)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {group.group}
                    {isOpen ? <FaChevronDown className="w-3 h-3" /> : <FaChevronRight className="w-3 h-3" />}
                  </button>
                )}

                <AnimatePresence initial={false}>
                  {(isCollapsed || isOpen) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-0.5 overflow-hidden"
                    >
                      {group.items.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={onCloseMobile}
                          title={isCollapsed ? item.name : undefined}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50 hover:translate-x-0.5"
                            }`
                          }
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
    <>
      <aside
        className={`hidden lg:block fixed top-0 bottom-0 left-0 z-30 sidebar-card border-r border-slate-800/50 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 w-72 h-full shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
