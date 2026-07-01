import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Framer motion import kiya
import {
  sendEmailOtp,
  sendMobileOtp,
  createAgent,
} from "../services/userService";
import { useNavigate } from "react-router-dom";

const AddAgent = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [emailTimer, setEmailTimer] = useState(0);
  const [mobileTimer, setMobileTimer] = useState(0);

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
    const loading = toast.loading("Creating agent...");

    try {
      await createAgent(data);

      toast.update(loading, {
        render: "Agent created successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => navigate("/admindashboard"), 800);

    } catch (error) {
      toast.update(loading, {
        render: error.message || "Something went wrong ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="relative text-gray-500 w-screen h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden p-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">

      {/* BACKGROUND FLOATING ORBS */}
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] w-[320px] h-[320px] top-[-60px] left-[30%] pointer-events-none select-none"></div>
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] [animation-delay:2s] w-[150px] h-[150px] top-[15%] right-[20%] pointer-events-none select-none"></div>
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] [animation-delay:1s] w-[220px] h-[220px] bottom-[15%] left-[10%] pointer-events-none select-none"></div>
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] [animation-delay:3s] w-[180px] h-[180px] bottom-[10%] right-[10%] pointer-events-none select-none"></div>

      {/* CARD CONTAINER WITH ENTRY ANIMATION */}
      <motion.div
        className="relative z-10 w-[35vw] max-w-xl p-8 rounded-[35px]
        backdrop-blur-[35px] bg-white/30 border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.08)] max-h-[95vh] flex flex-col justify-center"
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-[#243447]">
          Add New Agent
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-6 text-sm">
          Secure OTP Verified Agent Creation
        </p>

        {/* Custom Scroller Wrapper for Forms fields */}
        <form 
          onSubmit={handleSubmit(onSubmit, onError)} 
          className="space-y-3 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
        >

          {/* NAME */}
          <div>
            <input
              {...register("fullName", {
                required: "Full Name is required",
              })}
              placeholder="Full Name"
              className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <div className="flex gap-2">
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                placeholder="Email"
                className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition"
              />
              <button
                type="button"
                disabled={emailTimer > 0}
                onClick={(e) => handleEmailOtp(e.target.form.email.value)}
                className="px-4 text-sm w-[8vw] rounded-xl bg-gradient-to-r from-blue-300 to-blue-400 text-white font-semibold shadow-sm hover:brightness-105 active:scale-95 transition disabled:from-gray-400 disabled:to-gray-400 disabled:scale-100"
              >
                {emailTimer > 0 ? `${emailTimer}s` : "Send OTP"}
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* EMAIL OTP */}
          <div>
            <input
              {...register("emailOtp", {
                required: "Email OTP is required",
              })}
              placeholder="Email OTP"
              className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition"
            />
            {errors.emailOtp && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.emailOtp.message}</p>
            )}
          </div>

          {/* MOBILE */}
          <div>
            <div className="flex gap-2">
              <input
                {...register("mobileNumber", {
                  required: "Mobile Number is required",
                })}
                placeholder="Mobile Number"
                className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition"
              />
              <button
                type="button"
                disabled={mobileTimer > 0}
                onClick={(e) => handleMobileOtp(e.target.form.mobileNumber.value)}
                className="px-4 text-xs rounded-xl w-[8vw] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-semibold shadow-sm hover:brightness-105 active:scale-95 transition disabled:from-gray-400 disabled:to-gray-400 disabled:scale-100"
              >
                {mobileTimer > 0 ? `${mobileTimer}s` : "Send OTP"}
              </button>
            </div>
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobileNumber.message}</p>
            )}
          </div>

          {/* MOBILE OTP */}
          <div>
            <input
              {...register("mobileOtp", {
                required: "Mobile OTP is required",
              })}
              placeholder="Mobile OTP"
              className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition"
            />
            {errors.mobileOtp && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobileOtp.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Password"
              className="w-full p-3 rounded-xl bg-white/40 outline-none text-zinc-800 text-sm placeholder-gray-400 border border-transparent focus:border-white/60 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
            )}
          </div>

          {/* SUBMIT BUTTON WITH HOVER/CLICK EFFECT */}
          <motion.button
            className="w-full h-12 rounded-xl font-semibold text-md text-zinc-800 mt-4
            bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff] shadow-sm relative overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Create Agent →
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

export default AddAgent;