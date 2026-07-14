import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addNewPlanPolicy } from "../../services/PlanServices";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowLeft, FileText, Save } from "lucide-react";

const AddPolicyPlan = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    planName: "",
    coverageAmount: "",
    premiumAmount: "",
    premiumType: "",
    duration: "",
    termsConditions: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await addNewPlanPolicy(
        productId,
        formData.planName,
        formData.coverageAmount,
        formData.premiumAmount,
        formData.premiumType,
        formData.duration,
        formData.termsConditions
      );
      toast.success("Policy Plan Added Successfully ✅");
      setTimeout(() => navigate("/admindashboard"), 800);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed To Add Policy Plan ❌");
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
          <ArrowLeft size={16} className="text-slate-600 dark:text-slate-355" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white">
            Create Policy Plan
          </h1>
          <p className="text-xs text-slate-455 mt-0.5">
            Add a coverage plan option for Product ID #{productId}.
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
            <FileText size={18} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-450">
            Plan Option Specs
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Plan Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-455 uppercase tracking-wide">
              Plan Option Name
            </label>
            <input
              type="text"
              placeholder="e.g. Standard Platinum Cover"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
              required
              value={formData.planName}
              onChange={(e) =>
                setFormData({ ...formData, planName: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Coverage Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-455 uppercase tracking-wide">
                Coverage Amount (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 500000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                required
                value={formData.coverageAmount}
                onChange={(e) =>
                  setFormData({ ...formData, coverageAmount: e.target.value })
                }
              />
            </div>

            {/* Premium Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-455 uppercase tracking-wide">
                Premium Cost (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 15000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                required
                value={formData.premiumAmount}
                onChange={(e) =>
                  setFormData({ ...formData, premiumAmount: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-455 uppercase tracking-wide">
                Plan Duration (Years)
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                required
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>

            {/* Premium Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-455 uppercase tracking-wide">
                Payment Type
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/40 text-slate-855 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.premiumType}
                required
                onChange={(e) =>
                  setFormData({ ...formData, premiumType: e.target.value })
                }
              >
                <option value="" className="text-slate-400">Select Frequency</option>
                <option value="ANNUAL">ANNUAL</option>
                <option value="ONE_TIME">ONE_TIME</option>
              </select>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-455 uppercase tracking-wide">
              Terms & Conditions Summary
            </label>
            <textarea
              rows={3}
              placeholder="List crucial policy terms, exclusion criteria, or payout conditions..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder-gray-400"
              required
              value={formData.termsConditions}
              onChange={(e) =>
                setFormData({ ...formData, termsConditions: e.target.value })
              }
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
                <span>Save Policy Plan</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddPolicyPlan;