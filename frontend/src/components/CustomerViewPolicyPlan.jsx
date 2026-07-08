import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import usePolicyByProductId from "../hooks/usePolicyByProductId";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../services/userService";
import { FaArrowLeft, FaShieldAlt, FaShoppingCart, FaBan, FaRegClock, FaCoins, FaHandHoldingUsd, FaTimesCircle } from "react-icons/fa";

// Glowing Cyber Ambient Effects
const Orbs = () => (
  <>
    <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-500/10 to-indigo-500/5 top-[-100px] right-[10%] blur-3xl animate-float" />
    <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/5 bottom-[10%] left-[5%] blur-3xl animate-float delay-1000" />
  </>
);

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

const CustomerViewPolicyPlan = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { policyData, loading, error } = usePolicyByProductId(productId);
  const [cusData, setCusData] = useState(null);

  const getCusData = async () => {
    try {
      const data = await getCurrentUser();
      setCusData(data);
      console.log("Agent Data:", data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCusData();
  }, []);

  const role = useSelector((state) => state.auth.role);

  const data =
    role === "CUSTOMER"
      ? (policyData || []).filter((p) => p.active)
      : (policyData || []);

  // --- 1. PREMIUM ANIMATED SKELETON LOADING STATE ---
  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#070d19] p-6 md:p-10 overflow-hidden text-slate-300">
        <Orbs />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-7xl mx-auto z-10 relative space-y-8"
        >
          <div className="flex items-center gap-4 pb-4 border-b border-slate-900">
            <div className="h-10 w-10 bg-slate-900 rounded-xl animate-pulse" />
            <div className="h-8 w-48 bg-slate-900 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#111c30]/50 border border-slate-900/60 rounded-3xl p-6 space-y-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/10 to-transparent -translate-x-full animate-shimmer" />
                <div className="h-6 w-24 bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-7 w-48 bg-slate-800 rounded-lg animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-800/60 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-800/60 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-slate-800/60 rounded animate-pulse" />
                </div>
                <div className="h-12 w-full bg-slate-800/40 rounded-xl pt-4 animate-pulse" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070d19] text-slate-300 gap-3">
        <FaTimesCircle size={40} className="text-rose-500 animate-bounce" />
        <h2 className="text-xl font-bold tracking-wide">Failed To Load Protection Plans</h2>
        <button onClick={() => navigate(-1)} className="mt-2 text-xs font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <FaArrowLeft size={10} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070d19] p-6 md:p-10 overflow-hidden text-slate-300">
      <Orbs />

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8">
        
        {/* --- INTERACTIVE ACTION HEADER (With Back Button) --- */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 pb-4 border-b border-slate-900"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white transition-all group shrink-0"
              title="Go Back"
            >
              <FaArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide">
                Policy Plans
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Select and configure premium tier matrix coverage
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- PLANS DYNAMIC GRID --- */}
        {data.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {data.map((ele) => (
              <motion.div
                key={ele.planId}
                variants={cardVariants}
                className="bg-[#111c30] border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group transition-all duration-300"
                whileHover={{ 
                  y: -8, 
                  boxShadow: "0 20px 30px -10px rgba(168, 85, 247, 0.08)",
                  borderColor: "rgba(168, 85, 247, 0.3)"
                }}
              >
                {/* Internal Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  {/* Premium Type Badge & Status */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-900 text-xs font-mono font-medium text-purple-400 group-hover:border-purple-500/30 transition-colors">
                      <FaShieldAlt size={12} /> {ele.premiumType}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                      ele.active ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" : "text-rose-400 bg-rose-500/5 border-rose-500/10"
                    }`}>
                      {ele.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Plan Identifier */}
                  <h2 className="text-xl font-bold text-white tracking-wide group-hover:text-purple-400 transition-colors duration-200">
                    {ele.planName}
                  </h2>

                  {/* Coverage Spec Sheets */}
                  <div className="space-y-2 mt-4 mb-6 font-mono text-xs text-slate-400">
                    <div className="flex items-center gap-2.5 py-1.5 border-b border-slate-900/40">
                      <FaHandHoldingUsd className="text-purple-500 shrink-0 text-sm" />
                      <span>Coverage: <strong className="text-white">₹{ele.coverageAmount.toLocaleString('en-IN')}</strong></span>
                    </div>
                    <div className="flex items-center gap-2.5 py-1.5 border-b border-slate-900/40">
                      <FaCoins className="text-amber-500 shrink-0 text-sm" />
                      <span>Premium: <strong className="text-white">₹{ele.premiumAmount.toLocaleString('en-IN')}</strong></span>
                    </div>
                    <div className="flex items-center gap-2.5 py-1.5">
                      <FaRegClock className="text-cyan-400 shrink-0 text-sm" />
                      <span>Duration: <strong className="text-white">{ele.duration} Years</strong></span>
                    </div>
                  </div>
                </div>

                {/* --- CONTEXTUAL ACTION GATEWAY --- */}
                <div className="pt-2 relative z-10">
                  {role === "CUSTOMER" && cusData?.active ? (
                    <NavLink
                      to={`/purchasepolicy/${ele.planId}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-purple-400 bg-purple-500/10 hover:bg-purple-600 hover:text-white border border-purple-500/20 hover:border-transparent transition-all duration-200 shadow-md shadow-purple-950/20"
                    >
                      <FaShoppingCart size={12} /> Purchase Matrix
                    </NavLink>
                  ) : (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"
                    >
                      <FaBan size={12} /> {role === "CUSTOMER" ? "Account Suspended" : "Access Locked"}
                    </button>
                  )}
                </div>

              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-[#111c30]/30 rounded-3xl border border-slate-900 border-dashed"
          >
            <h2 className="text-base font-semibold text-slate-500 tracking-wide">
              No Protection Frameworks Synthesized Under This Product Pipeline
            </h2>
          </motion.div>
        )}
      </div>

      {/* Embedded High Performance Animation Engine */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.03); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-float { animation: float 12s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .delay-1000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default CustomerViewPolicyPlan;