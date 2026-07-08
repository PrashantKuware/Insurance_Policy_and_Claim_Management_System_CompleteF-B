import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  sendEmailOtp,
  sendMobileOtp,
  createAgent,
} from "../services/userService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, ShieldAlert, KeyRound, Mail, Phone, Lock, Save } from "lucide-react";

const AddAgent = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [emailTimer, setEmailTimer] = useState(0);
  const [mobileTimer, setMobileTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  /* TIMER HELPERS */
  const startTimer = (setter) => {
    setter(60);

    const interval = setInterval(() => {
      setter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailOtp = async (email) => {
    if (!email) return toast.error("Email required");

    try {
      await sendEmailOtp(email);
      toast.success("Email OTP sent 🚀");
      startTimer(setEmailTimer);
    } catch {
      toast.error("Failed to send email OTP");
    }
  };

  const handleMobileOtp = async (mobile) => {
    if (!mobile) return toast.error("Mobile required");

    try {
      await sendMobileOtp(mobile);
      toast.success("Mobile OTP sent 🚀");
      startTimer(setMobileTimer);
    } catch {
      toast.error("Failed to send mobile OTP");
    }
  };

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];
    toast.error(
      firstError?.message || "Please fill all required fields"
    );
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await createAgent(data);
      toast.success("Agent created successfully 🎉");
      setTimeout(() => navigate("/admindashboard"), 800);
    } catch (error) {
      toast.error(error.message || "Something went wrong ❌");
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
            Register Agent
          </h1>
          <p className="text-xs text-slate-455 mt-0.5">
            Add a new authorized Agent with email and mobile verification.
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
            <UserPlus size={18} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-455">
            Agent Credentials & Security
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-450 uppercase tracking-wide">
              Full Name
            </label>
            <input
              {...register("fullName", {
                required: "Full Name is required",
              })}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Verification Row */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-455 uppercase tracking-wide">
              Email Address
            </label>
            <div className="flex gap-2">
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                placeholder="e.g. agent@insurance.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
              />
              <button
                type="button"
                disabled={emailTimer > 0}
                onClick={(e) => handleEmailOtp(e.target.form.email.value)}
                className="w-24 sm:w-28 flex-shrink-0 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition active:scale-97 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:scale-100"
              >
                {emailTimer > 0 ? `${emailTimer}s` : "Send OTP"}
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Email OTP */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-450 uppercase tracking-wide">
              Email OTP
            </label>
            <input
              {...register("emailOtp", {
                required: "Email OTP is required",
              })}
              placeholder="Enter 6-digit Email OTP"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
            />
            {errors.emailOtp && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.emailOtp.message}</p>
            )}
          </div>

          {/* Mobile Verification Row */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-455 uppercase tracking-wide">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <input
                {...register("mobileNumber", {
                  required: "Mobile Number is required",
                })}
                placeholder="e.g. 9876543210"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
              />
              <button
                type="button"
                disabled={mobileTimer > 0}
                onClick={(e) => handleMobileOtp(e.target.form.mobileNumber.value)}
                className="w-24 sm:w-28 flex-shrink-0 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-97 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:scale-100"
              >
                {mobileTimer > 0 ? `${mobileTimer}s` : "Send OTP"}
              </button>
            </div>
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobileNumber.message}</p>
            )}
          </div>

          {/* Mobile OTP */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-450 uppercase tracking-wide">
              Mobile OTP
            </label>
            <input
              {...register("mobileOtp", {
                required: "Mobile OTP is required",
              })}
              placeholder="Enter 6-digit Mobile OTP"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
            />
            {errors.mobileOtp && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobileOtp.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-455 uppercase tracking-wide">
              Initial Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/40 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
            )}
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
                <span>Create Agent Profile</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddAgent;