import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const sendOtp = async () => {
    try {
      setSendingOtp(true);

      await axios.post(
        `http://localhost:8080/api/auth/forgot-password/send-otp?email=${email}`
      );

      toast.success("OTP Sent");
      setStep(2);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "Failed");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setVerifyingOtp(true);

      await axios.post(
        `http://localhost:8080/api/auth/forgot-password/verify-otp?email=${email}&otp=${otp}`
      );

      toast.success("OTP Verified");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data || "Invalid OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const resetPassword = async () => {
    try {
      setResettingPassword(true);

      await axios.post(
        "http://localhost:8080/api/auth/forgot-password/reset",
        {
          email,
          newPassword,
          confirmPassword,
        }
      );

      toast.success("Password Changed Successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data || "Failed");
    } finally {
      setResettingPassword(false);
    }
  };

  const BackgroundOrbs = () => {
    return (
      <>
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
        <div className="orb orb4"></div>
      </>
    );
  };

  return (
    <div className="relative text-gray-500 min-h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden">

      {/* animated background */}
      <div className="absolute inset-0 animate-spin-slow opacity-40">
        <div className="w-[200%] h-[200%] bg-[radial-gradient(circle,#dcefff_0%,transparent_25%),radial-gradient(circle,#b9daf5_0%,transparent_25%)]" />
      </div>

      <BackgroundOrbs />

      <motion.div
        className="relative z-10 w-full max-w-md p-10 rounded-[35px]
        backdrop-blur-[35px] bg-white/30 border border-white/40
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        initial={{ opacity: 0, scale: 0.7, y: 80 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-center text-[#243447]">
          Forgot Password
        </h1>

        <p className="text-center mt-2 mb-8 text-gray-500">
          Reset your account password
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 mb-4">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full bg-transparent outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={sendingOtp}
              className="w-full h-14 rounded-xl font-semibold
              bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff]
              hover:scale-105 transition disabled:opacity-60"
            >
              {sendingOtp ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Send OTP →"
              )}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 mb-4">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full bg-transparent outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              onClick={verifyOtp}
              disabled={verifyingOtp}
              className="w-full h-14 rounded-xl font-semibold
              bg-gradient-to-r from-green-200 to-green-400
              hover:scale-105 transition disabled:opacity-60"
            >
              {verifyingOtp ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Verify OTP →"
              )}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 mb-4">
              <input
                type="password"
                placeholder="New Password"
                className="w-full bg-transparent outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-transparent outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              onClick={resetPassword}
              disabled={resettingPassword}
              className="w-full h-14 rounded-xl font-semibold
              bg-gradient-to-r from-purple-200 to-purple-400
              hover:scale-105 transition disabled:opacity-60"
            >
              {resettingPassword ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Reset Password →"
              )}
            </button>
          </>
        )}
      </motion.div>

      {/* styles */}
      <style>{`
        @keyframes float {
          50% { transform: translateY(-30px) rotate(10deg); }
        }

        @keyframes spinSlow {
          100% { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spinSlow 18s linear infinite;
        }

        .orb {
          position: absolute;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, #fff, #9cc8eb);
          animation: float 8s ease-in-out infinite;
        }

        .orb1 { width: 320px; height: 320px; top: -60px; left: 30%; }
        .orb2 { width: 150px; height: 150px; top: 15%; right: 20%; animation-delay: 2s; }
        .orb3 { width: 220px; height: 220px; bottom: 15%; left: 10%; animation-delay: 1s; }
        .orb4 { width: 180px; height: 180px; bottom: 10%; right: 10%; animation-delay: 3s; }
      `}</style>
    </div>
  );
};

export default ForgetPassword;