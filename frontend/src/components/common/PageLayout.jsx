import React from "react";

const PageLayout = ({ children, className = "" }) => {
  return (
    <div className={`relative w-full py-6 px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Ambient background glow orbs */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: "3s" }} />

      <div className="relative max-w-7xl mx-auto w-full flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
