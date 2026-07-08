import { useEffect, useState } from "react";
import { getAllPolicy } from "../services/PlanServices";

export default function Card({plan}) {
    
  return (

    <div className="w-[300px] bg-[#111c30] border border-slate-800 rounded-2xl p-5 text-white shadow-lg hover:shadow-blue-500/10 transition-all">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">{plan.planName}</h2>

        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
          plan.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        }`}>
          {plan.active ? "ACTIVE" : "INACTIVE"}
        </span>
      </div>

      {/* Product Name */}
      <p className="text-sm text-slate-300 mb-2">
        {plan.productName}
      </p>

      <div className="space-y-2 text-sm text-slate-400">

        <div className="flex justify-between">
          <span>Coverage</span>
          <span className="text-white">₹{plan.coverageAmount}</span>
        </div>

        <div className="flex justify-between">
          <span>Premium</span>
          <span className="text-white">₹{plan.premiumAmount} ({plan.premiumType})</span>
        </div>

        <div className="flex justify-between">
          <span>Duration</span>
          <span className="text-white">{plan.duration} Year</span>
        </div>

      </div>

      {/* Terms */}
      <p className="text-xs text-slate-500 mt-4 line-clamp-2">
        {plan.termsConditions || "No terms available"}
      </p>

      {/* Button */}
      {/* <button className="w-full mt-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition">
        View Details
      </button> */}

    </div>
  );
}