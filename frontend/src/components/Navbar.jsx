import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";


const Navbar = () => {
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

  const navLinkStyle = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <nav className="
  bg-white
  dark:bg-gray-900
  border-b
  border-gray-200
  dark:border-gray-700
  text-black
  dark:text-white
">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Insurance Portal
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink to="/" className={navLinkStyle}>
              Home
            </NavLink>

            <NavLink to="/products" className={navLinkStyle}>
              Products
            </NavLink>

            <NavLink to="/plans" className={navLinkStyle}>
              Plans
            </NavLink>

            <NavLink to="/policies" className={navLinkStyle}>
              Policies
            </NavLink>

            <NavLink to="/claims" className={navLinkStyle}>
              Claims
            </NavLink>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            {token && (
              <div className="hidden lg:flex items-center gap-2">
                <FaUserShield className="text-blue-600" />

                <span className="font-medium text-gray-700 dark:text-white">
                  {userName || "User"}
                </span>

                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                  {role || "USER"}
                </span>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === "light" ? <FaMoon size={20} className="text-black" /> : <FaSun size={20} className="text-white"/>}
            </button>

            {/* Logout */}
            {token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all"
              >
                <FaSignOutAlt />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
