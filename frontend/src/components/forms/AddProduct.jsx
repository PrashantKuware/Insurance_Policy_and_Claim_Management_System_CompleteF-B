import React, { useState } from "react";
import { addNewProduct } from "../../services/ProductService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Plus, Save } from "lucide-react";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName.trim()) {
      return toast.error("Product Name is required");
    }
    if (!formData.productType) {
      return toast.error("Please select Product Type");
    }
    if (!formData.description.trim()) {
      return toast.error("Description is required");
    }

    try {
      setLoading(true);
      await addNewProduct(
        formData.productName,
        formData.productType,
        formData.description
      );
      toast.success("Product Added Successfully ✅");
      setTimeout(() => navigate("/admindashboard"), 800);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed To Add Product ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-slate-700 dark:text-slate-200">
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
            Create Product
          </h1>
          <p className="text-xs text-slate-455 mt-0.5">
            Add a new category of coverage policies to the system.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <motion.div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
            <Briefcase size={18} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-450">
            Product Specifications
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-450 uppercase tracking-wide">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. Life Shield Gold"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
              value={formData.productName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productName: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Product Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-450 uppercase tracking-wide">
              Coverage Type
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-855 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.productType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productType: e.target.value,
                })
              }
              required
            >
              <option value="" className="text-slate-400">Select Category</option>
              <option value="TRAVEL">TRAVEL</option>
              <option value="HEALTH">HEALTH</option>
              <option value="MOTOR">MOTOR</option>
              <option value="LIFE">LIFE</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-450 uppercase tracking-wide">
              Detailed Description
            </label>
            <textarea
              rows={4}
              placeholder="Provide a detailed breakdown of coverage perks, active criteria, and guidelines..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder-gray-400"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition active:scale-97 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={14} />
                <span>Save Product Specs</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;