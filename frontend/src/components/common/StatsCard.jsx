import React from "react";
import GlassCard from "./GlassCard";

const StatsCard = ({ title, value, icon: Icon, description, trend, trendType = "up" }) => {
  return (
    <GlassCard hoverable className="flex items-center justify-between p-6">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-800 dark:text-white">
            {value}
          </span>
          {trend && (
            <span className={`text-xs font-bold ${trendType === "up" ? "text-emerald-500" : "text-rose-500"}`}>
              {trend}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {description}
          </p>
        )}
      </div>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-blue-50/80 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </GlassCard>
  );
};

export default StatsCard;
