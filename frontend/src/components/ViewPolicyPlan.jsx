import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePolicyByProductId from "../hooks/usePolicyByProductId";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../services/userService";
import { FileText, ArrowLeft, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const ViewPolicyPlan = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { policyData, loading, error } = usePolicyByProductId(productId);

  const [cusData, setCusData] = useState(null);
  const role = useSelector((state) => state.auth.role) || localStorage.getItem("role");

  const getCusData = async () => {
    // Only call this API if the user is a CUSTOMER to avoid unnecessary load
    if (role !== "CUSTOMER") return;
    try {
      const data = await getCurrentUser();
      setCusData(data);
    } catch (error) {
      console.error("Error loading customer profile:", error);
    }
  };

  useEffect(() => {
    getCusData();
  }, [role]);

  const displayedPlans = role === "CUSTOMER"
    ? policyData.filter((p) => p.active)
    : policyData;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold text-red-500">Error Loading Policy Plans</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-2 text-sm text-blue-500 font-semibold hover:underline"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-700 dark:text-slate-200">
      {/* HEADER BAR */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <ArrowLeft size={16} className="text-slate-600 dark:text-slate-350" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white">
            Policy Plans
          </h1>
          <p className="text-xs text-slate-450 mt-0.5">
            Manage plans list for product ID #{productId}
          </p>
        </div>
      </div>

      {/* PLAN GRID */}
      {displayedPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPlans.map((ele) => (
            <motion.div
              key={ele.planId}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
              whileHover={{ y: -4 }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold tracking-wide">
                    {ele.premiumType}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Plan ID: #{ele.planId}
                  </span>
                </div>

                <h2 className="text-base font-black text-slate-850 dark:text-white mb-4 leading-snug">
                  {ele.planName}
                </h2>

                <div className="space-y-2 border-t border-b border-slate-100 dark:border-slate-800/60 py-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Coverage Limit</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{ele.coverageAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Premium Cost</span>
                    <span className="font-bold text-slate-800 dark:text-white">₹{ele.premiumAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duration Period</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{ele.duration} Years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Terms & Policy</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{ele.active ? "Active" : "Inactive"}</span>
                  </div>
                </div>

                {ele.termsConditions && (
                  <div className="mt-4">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Terms & Conditions</span>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500 leading-relaxed mt-1">
                      {ele.termsConditions}
                    </p>
                  </div>
                )}
              </div>

              {/* Purchase button is only visible to Customer module */}
              {role === "CUSTOMER" && (
                <div className="mt-6">
                  {cusData && cusData.active ? (
                    <NavLink
                      to={`/purchasepolicy/${ele.planId}`}
                      className="block text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 transition active:scale-97"
                    >
                      🛒 Purchase Policy
                    </NavLink>
                  ) : (
                    <button
                      disabled
                      className="w-full text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs"
                    >
                      Onboarding Inactive
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <FileText size={32} className="mx-auto text-slate-300 dark:text-slate-650 mb-2" />
          <h3 className="text-base font-bold text-slate-600 dark:text-slate-450">No Policy Plans Found</h3>
          <p className="text-xs text-slate-400 mt-1">This product has no active or inactive plans currently configured.</p>
        </div>
      )}
    </div>
  );
};

export default ViewPolicyPlan;