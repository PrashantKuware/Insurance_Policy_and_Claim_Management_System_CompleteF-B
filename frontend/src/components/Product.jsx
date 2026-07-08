import React, { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import useProducts from "../hooks/useGetAllProduct";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Search, Plus, Eye, ListPlus, Briefcase } from "lucide-react";

const Product = () => {
  const { productData, loading, error } = useProducts();
  const role = useSelector((state) => state.auth.role);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const filteredProducts = useMemo(() => {
    // Preserve customer filter logic just in case
    const baseData = role === "CUSTOMER" 
      ? productData.filter((p) => p.active === true) 
      : productData;

    return baseData.filter((product) => {
      const matchesSearch = 
        product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType ? product.productType === selectedType : true;

      return matchesSearch && matchesType;
    });
  }, [productData, role, searchQuery, selectedType]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(error?.message || "Failed To Load Products ❌");
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold text-red-500">Failed To Load Products</h2>
        <p className="text-xs text-slate-400 mt-1">Please check your network and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-700 dark:text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-white">Insurance Products</h2>
          <p className="text-xs text-slate-450 mt-0.5">Catalog of available coverage products</p>
        </div>

        {role === "ADMIN" && (
          <NavLink
            to="/addProduct"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition active:scale-97 self-start sm:self-center"
          >
            <Plus size={15} />
            <span>Add New Product</span>
          </NavLink>
        )}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search product name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Product Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="">All Categories</option>
          <option value="HEALTH">HEALTH</option>
          <option value="TRAVEL">TRAVEL</option>
          <option value="MOTOR">MOTOR</option>
          <option value="LIFE">LIFE</option>
        </select>
      </div>

      {/* GRID DISPLAY */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((ele) => (
            <motion.div
              key={ele.productId}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              whileHover={{ y: -5 }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide">
                    {ele.productType}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    PID: #{ele.productId}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-850 dark:text-white mb-2 leading-snug">
                  {ele.productName}
                </h3>

                <p className="text-slate-450 dark:text-slate-450 text-xs leading-relaxed min-h-[50px] mb-4">
                  {ele.description}
                </p>
              </div>

              <div>
                {/* Status indicator */}
                <div className="flex items-center justify-between text-xs font-semibold mb-5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">Status</span>
                  <span className={ele.active ? "text-emerald-600" : "text-rose-500"}>
                    {ele.active ? "● Active" : "● Inactive"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <NavLink
                    to={`/viewallplan/${ele.productId}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition active:scale-97"
                  >
                    <Eye size={14} />
                    <span>View Plans</span>
                  </NavLink>

                  {role === "ADMIN" && (
                    <NavLink
                      to={`/addplan/${ele.productId}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-805 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 transition active:scale-97"
                    >
                      <Plus size={14} />
                      <span>Add Plan</span>
                    </NavLink>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Briefcase size={32} className="mx-auto text-slate-300 dark:text-slate-650 mb-2" />
          <h3 className="text-base font-bold text-slate-600 dark:text-slate-450">No Products Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try a different search keyword or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default Product;