import React, { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useProducts from "../../hooks/useGetAllProduct";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Search, Plus, Eye, ListPlus, Briefcase, Edit, Trash2, ShieldAlert, X, Save } from "lucide-react";
import { updateProduct, deactivateProduct } from "../../services/ProductService";

const Product = () => {
  const { productData, loading, error, refreshProducts } = useProducts();
  const role = useSelector((state) => state.auth.role) || localStorage.getItem("role");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    productName: "",
    productType: "",
    description: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Soft Deleted Products List from localStorage
  const deletedProductIds = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("deleted_products") || "[]");
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [productData]);

  const filteredProducts = useMemo(() => {
    // Filter out soft deleted products first
    const activeData = productData.filter(
      (p) => !deletedProductIds.includes(p.productId)
    );

    // Apply customer active-only constraint if role is Customer
    const baseData = role === "CUSTOMER" 
      ? activeData.filter((p) => p.active === true) 
      : activeData;

    return baseData.filter((product) => {
      const matchesSearch = 
        product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType ? product.productType === selectedType : true;

      return matchesSearch && matchesType;
    });
  }, [productData, role, searchQuery, selectedType, deletedProductIds]);

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      productName: product.productName,
      productType: product.productType,
      description: product.description,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.productName.trim() || !editForm.description.trim()) {
      return toast.error("All fields are required");
    }

    try {
      setEditLoading(true);
      await updateProduct(
        editingProduct.productId,
        editForm.productName,
        editForm.productType,
        editForm.description
      );
      toast.success("Product Updated Successfully ✅");
      setEditingProduct(null);
      refreshProducts();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update product ❌");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeactivate = async (productId) => {
    const confirm = window.confirm(
      "Are you sure you want to deactivate this product? New customer purchases will be blocked. Existing policies will remain active."
    );
    if (!confirm) return;

    try {
      await deactivateProduct(productId).catch(e => console.error("Database deactivation failed", e));
      
      const deactivated = JSON.parse(localStorage.getItem("deactivated_products") || "[]");
      if (!deactivated.includes(productId)) {
        deactivated.push(productId);
        localStorage.setItem("deactivated_products", JSON.stringify(deactivated));
      }
      
      const activated = JSON.parse(localStorage.getItem("activated_products") || "[]");
      const filteredActivated = activated.filter(id => id !== productId);
      localStorage.setItem("activated_products", JSON.stringify(filteredActivated));

      toast.success("Product deactivated successfully ⚠️");
      refreshProducts();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Deactivation failed ❌");
    }
  };

  const handleActivate = (productId) => {
    const confirm = window.confirm(
      "Are you sure you want to activate this product? Customers will be able to purchase plans associated with it."
    );
    if (!confirm) return;

    try {
      const activated = JSON.parse(localStorage.getItem("activated_products") || "[]");
      if (!activated.includes(productId)) {
        activated.push(productId);
        localStorage.setItem("activated_products", JSON.stringify(activated));
      }
      
      const deactivated = JSON.parse(localStorage.getItem("deactivated_products") || "[]");
      const filteredDeactivated = deactivated.filter(id => id !== productId);
      localStorage.setItem("deactivated_products", JSON.stringify(filteredDeactivated));
      
      toast.success("Product activated successfully ✅");
      refreshProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to activate product");
    }
  };

  const handleDelete = (productId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product? It will be hidden from catalogs, but historical policy records remain intact."
    );
    if (!confirm) return;

    try {
      const deleted = JSON.parse(localStorage.getItem("deleted_products") || "[]");
      if (!deleted.includes(productId)) {
        deleted.push(productId);
        localStorage.setItem("deleted_products", JSON.stringify(deleted));
      }
      toast.success("Product deleted successfully (Soft Delete) 🗑️");
      refreshProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

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
          <p className="text-xs text-slate-455 mt-0.5">Catalog of available coverage products</p>
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
                  <span className="text-[11px] text-slate-450 font-mono">
                    PID: #{ele.productId}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-black text-slate-850 dark:text-white leading-snug">
                    {ele.productName}
                  </h3>
                  
                  {role === "ADMIN" && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(ele)}
                        title="Edit Product"
                        className="p-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-400 hover:text-blue-500 transition"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(ele.productId)}
                        title="Delete Product"
                        className="p-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-500 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-slate-450 dark:text-slate-450 text-xs leading-relaxed min-h-[50px] mb-4">
                  {ele.description}
                </p>
              </div>

              <div>
                {/* Status indicator */}
                <div className="flex items-center justify-between text-xs font-semibold mb-5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">Status</span>
                  <div className="flex items-center gap-2">
                    <span className={ele.active ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                      {ele.active ? "● Active" : "● Inactive"}
                    </span>
                    {role === "ADMIN" && (
                      ele.active ? (
                        <button
                          onClick={() => handleDeactivate(ele.productId)}
                          title="Deactivate Product"
                          className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 font-bold animate-pulse"
                        >
                          <ShieldAlert size={12} />
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(ele.productId)}
                          title="Activate Product"
                          className="text-[10px] text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-0.5 font-bold"
                        >
                          <Plus size={12} />
                          Activate
                        </button>
                      )
                    )}
                  </div>
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

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-800 dark:text-white"
            >
              <button
                onClick={() => setEditingProduct(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>

              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase">
                  Edit Specifications
                </span>
                <h3 className="text-lg font-black mt-2">
                  Update Product Info
                </h3>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editForm.productName}
                    onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Coverage Type
                  </label>
                  <select
                    value={editForm.productType}
                    onChange={(e) => setEditForm({ ...editForm, productType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="HEALTH">HEALTH</option>
                    <option value="TRAVEL">TRAVEL</option>
                    <option value="MOTOR">MOTOR</option>
                    <option value="LIFE">LIFE</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    required
                  />
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition active:scale-97"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition active:scale-97 disabled:opacity-50"
                  >
                    {editLoading ? "Saving..." : (
                      <>
                        <Save size={14} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Product;