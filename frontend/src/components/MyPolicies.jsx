import React, { useEffect, useState } from "react";
import { getAllPoliciesByCustomer } from "../services/policyService";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Staggered fluid micro-interactions
import {
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const MyPolicies = () => {
  const [policyData, setPolicyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyPolicies = async () => {
    try {
      setLoading(true);
      const data = await getAllPoliciesByCustomer();
      setPolicyData(data || []);
    } catch (error) {
      toast.error("Failed To Load Policies ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyPolicies();
  }, []);

  return (
    <section className="bg-[#111c30] rounded-[32px] border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-8 border-b border-slate-800/60 bg-slate-900/40">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            My Policies
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            View and manage your purchased insurance plans
          </p>
        </div>

        <NavLink
          to="/customer/policies"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/10 hover:opacity-95 active:scale-95 transition-all"
        >
          View All
          <FaArrowRight className="text-xs" />
        </NavLink>
      </div>

      {/* Main Body content area */}
      <div className="p-8">
        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 rounded-3xl bg-[#121e36] border border-slate-800/50 animate-pulse"
              />
            ))}
          </div>
        ) : policyData.length === 0 ? (
          /* Empty State Dashboard Window */
          <div className="py-12 text-center max-w-sm mx-auto">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
                <FaShieldAlt size={40} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">
              No Policies Found
            </h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Purchase a policy to start building your dynamic secure insurance portfolio today.
            </p>
          </div>
        ) : (
          /* Cards Grid Wrapper with Framer motion entry hook */
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.08 }}
          >
            {policyData.slice(0, 3).map((policy) => (
              <motion.div
                key={policy.policyId}
                whileHover={{ y: -6, borderColor: "rgba(59, 130, 246, 0.3)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                className="bg-[#121e36]/60 border border-slate-800/90 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden shadow-sm"
              >
                {/* Visual Accent glow line inside card */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Card Title Header details */}
                  <div className="flex justify-between items-start mb-6 gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                        Insurance Plan
                      </p>
                      <h3 className="font-extrabold text-lg text-white mt-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {policy.planName}
                      </h3>
                    </div>

                    <span
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 shadow-sm ${
                        policy.policyStatus === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {policy.policyStatus === "ACTIVE" ? (
                        <FaCheckCircle className="text-xs" />
                      ) : (
                        <FaClock className="text-xs" />
                      )}
                      {policy.policyStatus}
                    </span>
                  </div>

                  {/* Policy core metric rows */}
                  <div className="space-y-3.5 text-sm border-t border-slate-800/60 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-medium">Policy ID</span>
                      <span className="font-mono text-xs font-bold text-slate-300 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-md">
                        #{policy.policyId}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-medium">Premium Paid</span>
                      <span className="font-bold text-white text-md">
                        ₹{Number(policy.totalPremiumPaid).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-medium">Status</span>
                      <span
                        className={`text-xs font-bold ${
                          policy.policyStatus === "ACTIVE"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        ● {policy.policyStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Link Trigger */}
                <NavLink
                  to={`/policy/${policy.policyId}`}
                  className="mt-6 block text-center py-3 rounded-xl bg-[#0b1426] text-white text-xs font-semibold border border-slate-800 hover:bg-blue-600 hover:border-transparent active:scale-98 transition-all shadow-sm"
                >
                  View Details
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MyPolicies;