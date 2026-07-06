import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold">
        <span>&copy; {year} Insurance Pro Enterprise. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
