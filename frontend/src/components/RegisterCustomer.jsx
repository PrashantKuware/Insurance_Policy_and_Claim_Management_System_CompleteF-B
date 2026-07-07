import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  sendEmailOtp,
  sendMobileOtp,
  registerCustomer,
} from "../services/userService";

const BackgroundOrbs = () => {
  return (
    <>
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] w-[320px] h-[320px] top-[-60px] left-[30%] pointer-events-none select-none"></div>
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] [animation-delay:2s] w-[150px] h-[150px] top-[15%] right-[20%] pointer-events-none select-none"></div>
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] [animation-delay:1s] w-[220px] h-[220px] bottom-[15%] left-[10%] pointer-events-none select-none"></div>
      <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#9cc8eb)] animate-[float_8s_ease-in-out_infinite] [animation-delay:3s] w-[180px] h-[180px] bottom-[10%] right-[10%] pointer-events-none select-none"></div>
    </>
  );
};

const RegisterCustomer = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [emailTimer, setEmailTimer] = useState(0);
  const [mobileTimer, setMobileTimer] = useState(0);

  /* TIMER LOGIC */
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
    if (!email) return toast.error("Email required ❌");
    const loading = toast.loading("Sending Email OTP...");

    try {
      await sendEmailOtp(email);
      toast.update(loading, {
        render: "Email OTP sent 🚀",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      startTimer(setEmailTimer);
    } catch (error) {
      toast.update(loading, {
        render: error.message || "Failed to send Email OTP ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleMobileOtp = async (mobile) => {
    if (!mobile) return toast.error("Mobile required ❌");
    const loading = toast.loading("Sending Mobile OTP...");

    try {
      await sendMobileOtp(mobile);
      toast.update(loading, {
        render: "Mobile OTP sent 🚀",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      startTimer(setMobileTimer);
    } catch (error) {
      toast.update(loading, {
        render: error.message || "Failed to send Mobile OTP ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const onSubmit = async (data) => {
    const loading = toast.loading("Registering customer...");

    try {
      await registerCustomer(data);
      toast.update(loading, {
        render: "Registered successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      toast.update(loading, {
        render: error.message || "Registration failed ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    /* h-screen + overflow-hidden aur screen specifications targets se kisi bhi device pe scroll bars blocks rahenge */
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden p-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
      
      {/* Animated spinning background filter matrix */}
      <div className="absolute inset-0 animate-[spin_18s_linear_infinite] opacity-40 pointer-events-none select-none overflow-hidden">
        <div className="w-[200vw] h-[200vh] absolute top-[-50vw] left-[-50vw] bg-[radial-gradient(circle,#dcefff_0%,transparent_25%),radial-gradient(circle,#b9daf5_0%,transparent_25%)]" />
      </div>

      <BackgroundOrbs />

      {/* Form container component scale aur size optimizations ke sath taaki 720p height par vertical clip na ho */}
      <motion.div
        className="relative z-10 w-[35vw] max-w-xl p-8 rounded-[35px]
        backdrop-blur-[35px] bg-white/30 border border-white/40
        shadow-[0_20px_60px_rgba(0,0,0,0.08)] max-h-[95vh] flex flex-col justify-center"
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-center text-[#243447]">
          Customer Registration
        </h1>

        <p className="text-center mt-2 mb-6 text-gray-500 text-sm">
          Create your secure account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
          
          {/* NAME */}
          <div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/40 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
              <FaUser className="text-gray-500 text-sm" />
              <input
                {...register("fullName", { required: "Name required" })}
                placeholder="Full Name"
                className="w-full bg-transparent outline-none text-zinc-800 text-sm placeholder-gray-400"
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-[11px] mt-0.5 ml-2">{errors.fullName.message}</p>
            )}
          </div>

          {/* EMAIL + OTP GENERATION */}
          <div className="space-y-1">
            <div className="flex gap-2">
              <div className="flex items-center gap-4 p-3 flex-1 rounded-xl bg-white/40 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
                <FaEnvelope className="text-gray-500 text-sm" />
                <input
                  {...register("email", { required: "Email required" })}
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent outline-none text-zinc-800 text-sm placeholder-gray-400"
                />
              </div>

              <button
                type="button"
                disabled={emailTimer > 0}
                onClick={(e) => {
                  const form = e.target.form;
                  handleEmailOtp(form.elements.namedItem("email")?.value);
                }}
                className="px-4 rounded-xl bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff] font-semibold text-zinc-800 text-xs shadow-sm hover:scale-102 active:scale-98 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed transition"
              >
                {emailTimer > 0 ? `${emailTimer}s` : "Send OTP"}
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-[11px] ml-2">{errors.email.message}</p>
            )}
          </div>

          {/* EMAIL OTP INPUT */}
          <div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/40 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
              <FaKey className="text-gray-500 text-sm" />
              <input
                {...register("emailOtp", { required: "Email OTP verification required" })}
                placeholder="Enter Email OTP"
                className="w-full bg-transparent outline-none text-zinc-800 text-sm placeholder-gray-400"
              />
            </div>
            {errors.emailOtp && (
              <p className="text-red-500 text-[11px] mt-0.5 ml-2">{errors.emailOtp.message}</p>
            )}
          </div>

          {/* MOBILE + OTP GENERATION */}
          <div className="space-y-1">
            <div className="flex gap-2">
              <div className="flex items-center gap-4 p-3 flex-1 rounded-xl bg-white/40 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
                <FaPhone className="text-gray-500 text-sm" />
                <input
                  {...register("mobileNumber", { required: "Mobile number required" })}
                  placeholder="Mobile Number"
                  className="w-full bg-transparent outline-none text-zinc-800 text-sm placeholder-gray-400"
                />
              </div>

              <button
                type="button"
                disabled={mobileTimer > 0}
                onClick={(e) => {
                  const form = e.target.form;
                  handleMobileOtp(form.elements.namedItem("mobileNumber")?.value);
                }}
                className="px-4 rounded-xl bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff] font-semibold text-zinc-800 text-xs shadow-sm hover:scale-102 active:scale-98 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed transition"
              >
                {mobileTimer > 0 ? `${mobileTimer}s` : "Send OTP"}
              </button>
            </div>
            {errors.mobileNumber && (
              <p className="text-red-500 text-[11px] ml-2">{errors.mobileNumber.message}</p>
            )}
          </div>

          {/* MOBILE OTP INPUT */}
          <div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/40 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
              <FaKey className="text-gray-500 text-sm" />
              <input
                {...register("mobileOtp", { required: "Mobile OTP verification required" })}
                placeholder="Enter Mobile OTP"
                className="w-full bg-transparent outline-none text-zinc-800 text-sm placeholder-gray-400"
              />
            </div>
            {errors.mobileOtp && (
              <p className="text-red-500 text-[11px] mt-0.5 ml-2">{errors.mobileOtp.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/40 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
              <FaLock className="text-gray-500 text-sm" />
              <input
                type="password"
                {...register("password", { required: "Password field required" })}
                placeholder="Password"
                className="w-full bg-transparent outline-none text-zinc-800 text-sm placeholder-gray-400"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-[11px] mt-0.5 ml-2">{errors.password.message}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            type="submit"
            className="w-full h-12 rounded-xl text-md font-semibold text-zinc-800 mt-4
            bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff] shadow-sm relative overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Register →
          </motion.button>
        </form>

        <p className="text-center mt-4 text-xs text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
      
      {/* CSS Injection configuration */}
      <style>{`
        @keyframes float {
          50% { transform: translateY(-30px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default RegisterCustomer;