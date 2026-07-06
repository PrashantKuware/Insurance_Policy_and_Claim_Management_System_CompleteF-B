import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import IconButton from "./common/IconButton";

const ROUTE_LABELS = {
  admindashboard: "Dashboard",
  allProducts: "Products",
  addProduct: "Add Product",
  allCustomers: "Customers",
  addCustomer: "Add Customer",
  allAgents: "Agents",
  addagent: "Add Agent",
  viewallclaim: "Claims",
  viewallplan: "Policy Plans",
  addplan: "Add Plan",
  agentdashboard: "Dashboard",
  customerdashboard: "Dashboard",
};

const Navbar = ({ isCollapsed, onToggleSidebar, onToggleMobileSidebar, pageTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Home", path: role === "AGENT" ? "/agentdashboard" : role === "CUSTOMER" ? "/customerdashboard" : "/admindashboard" }];

    segments.forEach((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      const label = ROUTE_LABELS[segment] || segment.replace(/-/g, " ");
      crumbs.push({ label, path });
    });

    return crumbs;
  }, [location.pathname, role]);

  const displayTitle = pageTitle || breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/", { replace: true });
  };

  return (
    <nav
      className={`navbar-card sticky top-0 z-40 transition-shadow duration-300 px-4 sm:px-6 py-3 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <IconButton
            icon={isCollapsed ? FaChevronRight : FaChevronLeft}
            onClick={onToggleSidebar}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:inline-flex"
          />
          <IconButton
            icon={FaBars}
            onClick={onToggleMobileSidebar}
            title="Open menu"
            className="lg:hidden"
          />

          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
              {displayTitle}
            </h2>
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {breadcrumbs.map((crumb, idx) => (
                <span key={`${crumb.path}-${idx}`} className="flex items-center gap-1.5 min-w-0">
                  {idx > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-blue-600 dark:text-blue-400 truncate capitalize">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="hover:text-blue-600 dark:hover:text-blue-400 truncate capitalize transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="relative">
            <IconButton icon={FaBell} title="Notifications" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900 pointer-events-none" />
          </div>

          <IconButton
            icon={theme === "light" ? FaMoon : FaSun}
            onClick={toggleTheme}
            title="Toggle theme"
            className={theme === "dark" ? "text-amber-400" : ""}
          />

          {token && (
            <>
              <span className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="block text-xs font-bold text-slate-800 dark:text-white leading-tight">
                      {userName || "User"}
                    </span>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                      {role || "Admin"}
                    </span>
                  </div>
                  <FaChevronDown className={`w-3 h-3 text-slate-400 hidden lg:block transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-52 page-card p-2 shadow-xl z-50 bg-white dark:bg-slate-900"
                  >
                    <div className="px-3 py-2 border-b border-slate-200/60 dark:border-slate-700/60 mb-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{userName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
                    </div>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => { setProfileOpen(false); navigate(role === "ADMIN" ? "/admindashboard" : role === "AGENT" ? "/agentdashboard" : "/customerdashboard"); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <FaUserCircle className="w-4 h-4" /> Profile
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => { setProfileOpen(false); navigate(role === "ADMIN" ? "/admindashboard" : role === "AGENT" ? "/agentdashboard" : "/customerdashboard"); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <FaCog className="w-4 h-4" /> Settings
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    >
                      <FaSignOutAlt className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
