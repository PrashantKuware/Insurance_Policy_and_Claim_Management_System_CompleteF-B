import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
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

  return (
    <nav
      className="
        bg-white
        dark:bg-gray-900
        border-b
        border-gray-200
        dark:border-gray-700
        shadow-md
        sticky
        top-0 z-50
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left Side - Username */}
        {token ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome
              </p>

              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                {userName || "User"}
              </h2>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {/* Everything aligned to the right */}

        <div className="flex justify-end items-center gap-4">

          {/* User Info */}
          {token && (
            <div className="hidden lg:flex items-center gap-2">
              <FaUserShield className="text-blue-600 text-lg" />

              <span
                className="
                  px-2 py-1
                  text-xs
                  rounded-full
                  bg-blue-100
                  text-blue-700
                  dark:bg-blue-900
                  dark:text-blue-200
                "
              >
                {role || "USER"}
              </span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
              p-2
              rounded-full
              hover:bg-gray-200
              dark:hover:bg-gray-700
              transition
              cursor-pointer
            "
          >
            {theme === "light" ? (
              <FaMoon
                size={20}
                className="text-black dark:text-white"
              />
            ) : (
              <FaSun
                size={20}
                className="text-yellow-400"
              />
            )}
          </button>

          {/* Logout Button */}
          {token && (
            <button
              onClick={handleLogout}
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                bg-red-500
                hover:bg-red-600
                text-white
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <FaSignOutAlt />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;