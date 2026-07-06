import React from "react";
import { FaInbox } from "react-icons/fa";

const EmptyState = ({
  title = "No data found",
  description = "There are no records to display at the moment.",
  icon: Icon = FaInbox,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/20 dark:bg-slate-900/10 backdrop-blur-sm max-w-md mx-auto w-full">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[260px] leading-relaxed mb-5">
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
