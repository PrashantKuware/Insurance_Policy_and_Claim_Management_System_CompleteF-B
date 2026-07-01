import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useProducts from "../hooks/useGetAllProduct";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaPlus, FaEye, FaLayerGroup, FaTimesCircle, FaShieldAlt } from "react-icons/fa";
import { getProductBtProductType } from "../services/ProductService";

// Upgraded Dark Theme Neon Ambient Orbs
const Orbs = () => (
  <>
    <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-indigo-500/5 top-[-100px] left-[20%] blur-3xl animate-float" />
    <div className="absolute w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-purple-500/5 to-pink-500/5 top-[20%] right-[10%] blur-3xl animate-float delay-2000" />
    <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-blue-500/10 to-cyan-500/5 bottom-[10%] left-[5%] blur-3xl animate-float delay-1000" />
  </>
);

// Framer Motion Variants for Staggered List entry animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08 // हर कार्ड के आने में मामूली डिले (Cascade Effect)
    }
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

const CustomerProduct = () => {
  const [prodData, setProdData] = useState([])
  let { productData, loading, error } = useProducts();
  const role = useSelector((state) => state.auth.role);
  const params = useParams()
  const productType = params.productType

  const getByProductType = async () => {
    try {
      const data = await getProductBtProductType(productType)
      setProdData(data)
      console.log(data)
    } catch (error) {
    toast.error(error?.message || "Failed To Load Products ❌");
      console.log(error)
    }
  }

  useEffect(() => {
    if (productType) {
      getByProductType()
    }
  }, [])

  const displayData = productType ? prodData : productData

  const filteredProducts =
    role === "CUSTOMER"
      ? (displayData || []).filter((p) => p.active === true)
      : (displayData || []);

  // --- 1. SLEEK ANIMATED SHIMMER SKELETON LOADING STATE ---
  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#070d19] p-6 md:p-10 overflow-hidden text-slate-300">
        <Orbs />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-7xl mx-auto z-10 relative space-y-8"
        >
          <div className="flex justify-between items-center pb-4 border-b border-slate-900">
            <div className="h-10 w-64 bg-slate-900 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#111c30]/50 border border-slate-900/60 rounded-3xl p-6 space-y-5 relative overflow-hidden"
              >
                {/* Simulated Shimmer Sweeper Beam Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/10 to-transparent -translate-x-full animate-shimmer" />

                <div className="flex justify-between">
                  <div className="h-6 w-24 bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-5 w-16 bg-slate-800 rounded-md animate-pulse" />
                </div>
                <div className="h-8 w-44 bg-slate-800 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-slate-800/80 rounded animate-pulse" />
                  <div className="h-3.5 w-5/6 bg-slate-800/80 rounded animate-pulse" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-900/40">
                  <div className="h-10 flex-1 bg-slate-800/60 rounded-xl animate-pulse" />
                  <div className="h-10 flex-1 bg-slate-800/60 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    toast.error(error?.message || "Failed To Load Products ❌");
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-[#070d19] text-slate-300 gap-3"
      >
        <FaTimesCircle size={40} className="text-rose-500 animate-bounce" />
        <h2 className="text-xl font-bold tracking-wide">
          Failed To Load Product Pipeline Telemetry
        </h2>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070d19] p-6 md:p-10 overflow-hidden text-slate-300">

      <Orbs />

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8">

        {/* --- 2. HEADER VIEW ENTRANCE ANIMATION --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900"
        >
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">
              Insurance Products
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Browse and deploy high-clearance protection matrices
            </p>
          </div>

          {role === "ADMIN" && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavLink
                to="/addProduct"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-cyan-400 bg-cyan-500/10 hover:bg-cyan-600 hover:text-white border border-cyan-500/20 hover:border-transparent transition-all duration-200 shadow-lg shadow-cyan-950/20"
              >
                <FaPlus size={12} /> Add Product
              </NavLink>
            </motion.div>
          )}
        </motion.div>

        {/* --- 3. PRODUCT GRID SYSTEM (STAGGERED ANIMATION LAYER) --- */}
        {filteredProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((ele) => (
              <motion.div
                key={ele.productId}
                variants={cardVariants}
                className="bg-[#111c30] border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group transition-all duration-300"
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 30px -10px rgba(6, 182, 212, 0.08)",
                  borderColor: "rgba(6, 182, 212, 0.3)"
                }}
              >
                {/* Ambient Radial Hover Back-Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/0 to-cyan-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  {/* Category Badge & Status Meta */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-900 text-xs font-mono font-medium text-cyan-400 group-hover:border-cyan-500/30 transition-colors">
                      <FaShieldAlt size={12} className="group-hover:rotate-12 transition-transform" /> {ele.productType}
                    </span>

                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border
                      ${ele.active
                        ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10"
                        : "text-rose-400 bg-rose-500/5 border-rose-500/10"
                      }`}
                    >
                      {ele.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h2 className="text-xl font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors duration-200">
                    {ele.productName}
                  </h2>

                  {/* Description Meta */}
                  <p className="text-slate-400 text-xs leading-relaxed mt-2.5 mb-6 min-h-[60px] line-clamp-3">
                    {ele.description}
                  </p>
                </div>

                {/* --- GRID CONTROLS (BUTTONS) --- */}
                <div className="flex gap-3 pt-4 border-t border-slate-900/60 relative z-10">
                  <NavLink
                    to={`/viewallplancustomer/${ele.productId}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-950/40 border border-slate-900 hover:border-slate-800 text-slate-300 hover:text-white transition-all duration-200 hover:bg-slate-900"
                  >
                    <FaEye size={12} className="text-cyan-400 group-hover:scale-110 transition-transform" /> Plans
                  </NavLink>
                </div>

              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-16 bg-[#111c30]/30 rounded-3xl border border-slate-900 border-dashed"
          >
            <h2 className="text-lg font-semibold text-slate-500 tracking-wide">
              No Insurance Pipelines Synchronized
            </h2>
          </motion.div>
        )}
      </div>

      {/* CSS Layout Engine Extensions */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.05); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 1.8s infinite;
        }
        .delay-1000 { animation-delay: 1.5s; }
        .delay-2000 { animation-delay: 3s; }
      `}</style>

    </div>
  );
};

export default CustomerProduct;