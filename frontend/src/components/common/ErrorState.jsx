import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import SecondaryButton from "./SecondaryButton";

const ErrorState = ({
  title = "Failed to load data",
  message = "An error occurred while communicating with the server. Please check your connection and try again.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-red-200/50 dark:border-red-900/30 rounded-2xl bg-red-50/30 dark:bg-red-950/5 backdrop-blur-sm max-w-md mx-auto w-full">
      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-500 dark:text-red-400 flex items-center justify-center mb-4">
        <FaExclamationTriangle className="w-5 h-5 animate-pulse" />
      </div>
      <h3 className="text-base font-bold text-red-600 dark:text-red-400 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed mb-5">
        {message}
      </p>
      {onRetry && (
        <SecondaryButton onClick={onRetry} className="border-red-200 hover:bg-red-50/20 text-red-600 dark:text-red-400">
          Retry Connection
        </SecondaryButton>
      )}
    </div>
  );
};

export default ErrorState;
