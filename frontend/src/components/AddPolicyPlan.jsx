import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addNewPlanPolicy } from "../services/PlanServices";
import { motion } from "framer-motion"; // Framer motion import kiya
import { toast } from "react-toastify";

const AddPolicyPlan = () => {
  const [formData, setFormData] = useState({
    planName: "",
    coverageAmount: "",
    premiumAmount: "",
    premiumType: "",
    duration: "",
    termsConditions: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { productId } = useParams();

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
      toast.error(error?.response?.data?.message || "Failed To Add Policy ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative text-gray-500 w-screen h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden p-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">

      {/* BACKGROUND ORBS */}
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] w-[320px] h-[320px] top-[-60px] left-[30%] pointer-events-none select-none"></div>
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] [animation-delay:2s] w-[150px] h-[150px] top-[15%] right-[20%] pointer-events-none select-none"></div>
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] [animation-delay:1s] w-[220px] h-[220px] bottom-[15%] left-[10%] pointer-events-none select-none"></div>
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] [animation-delay:3s] w-[180px] h-[180px] bottom-[10%] right-[10%] pointer-events-none select-none"></div>

      {/* CARD CONTAINER WITH ENTRY ANIMATION */}
      <motion.div
        className="relative z-10 w-[35vw] max-w-xl p-8 rounded-[35px]
        backdrop-blur-[35px] bg-white/30 border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.08)] max-h-[95vh] flex flex-col justify-center"
        initial={{ opacity: 0, scale: 0.7, y: 40 }} // Starting state
        animate={{ opacity: 1, scale: 1, y: 0 }}    // Load state
        transition={{ duration: 0.8 }}              // Speed of animation
      >
        <h1 className="text-3xl font-bold text-center text-[#243447]">
          Insurance Portal
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6 text-sm">
          Add Policy Plan
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">

          <input
            className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition"
            placeholder="Plan Name"
            required
            value={formData.planName}
            onChange={(e) =>
              setFormData({ ...formData, planName: e.target.value })
            }
          />

          <div className="flex gap-3">
            <input
              className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition"
              type="number"
              required
              placeholder="Coverage Amount"
              value={formData.coverageAmount}
              onChange={(e) =>
                setFormData({ ...formData, coverageAmount: e.target.value })
              }
            />

            <input
              className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition"
              type="number"
              required
              placeholder="Premium Amount"
              value={formData.premiumAmount}
              onChange={(e) =>
                setFormData({ ...formData, premiumAmount: e.target.value })
              }
            />
          </div>

          <input
            className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition"
            type="number"
            placeholder="Duration (Months)"
            required
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />

          <select
            className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm border border-transparent focus:border-white/60 transition"
            value={formData.premiumType}
            required
            onChange={(e) =>
              setFormData({ ...formData, premiumType: e.target.value })
            }
          >
            <option value="" className="text-gray-400">Select Premium Type</option>
            <option value="ANNUAL">ANNUAL</option>
            <option value="ONE_TIME">ONE_TIME</option>
          </select>

          <textarea
            className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition resize-none"
            rows={3}
            required
            placeholder="Terms & Conditions"
            value={formData.termsConditions}
            onChange={(e) =>
              setFormData({ ...formData, termsConditions: e.target.value })
            }
          />

          {/* BUTTON WITH HOVER/CLICK EFFECT */}
          <motion.button
            disabled={loading}
            className="w-full h-12 rounded-xl font-semibold text-md text-zinc-800 mt-4
            bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff] shadow-sm relative overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Adding..." : "Add Plan →"}
          </motion.button>

        </form>
      </motion.div>

      <style>{`
        @keyframes float {
          50% { transform: translateY(-30px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default AddPolicyPlan;