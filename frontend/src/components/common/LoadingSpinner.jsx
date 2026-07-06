import React from "react";

const LoadingSpinner = ({ fullPage = false, size = "md", message = "Loading..." }) => {
  const spinnerSize = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-12 h-12" : "w-8 h-8";

  const spinnerMarkup = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${spinnerSize} rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 dark:border-t-blue-400 animate-spin`} />
      {message && <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-sm">
        {spinnerMarkup}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center w-full">{spinnerMarkup}</div>;
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-slate-150 dark:border-slate-800 shimmer">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="px-6 py-4.5 align-middle">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default LoadingSpinner;
