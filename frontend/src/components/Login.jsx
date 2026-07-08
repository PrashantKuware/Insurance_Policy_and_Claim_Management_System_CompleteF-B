import React, { useState } from "react";
import { loginService } from "../services/loginservice";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { toast } from "react-toastify";
import { customerExists } from "../services/CustomerService";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !pass.trim()) {
      toast.warning("Please Enter Email And Password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginService(email, pass);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userName", data.fullName);
      
      const decoded = jwtDecode(data.token);

      dispatch(
        login({
          token: data.token,
          role: decoded.role,
        })
      );

      toast.success("Login Successful ✅");

      setTimeout( async () =>{
        if (decoded.role === "ADMIN") {

          navigate("/admindashboard");

        }
        else if (decoded.role === "AGENT") {

          navigate("/agentdashboard");

        }
        else if (decoded.role === "CUSTOMER") {

          const exists = await customerExists();

          if (exists) {

            navigate("/customerdashboard");

          } else {

            navigate("/addCustomer");

          }
        }
      }, 800);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid Email Or Password ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative text-gray-500 h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden">

      {/* animated background layer */}
      <div className="absolute inset-0 animate-spin-slow opacity-40">
        <div className="w-[200%] h-[200%] bg-[radial-gradient(circle,#dcefff_0%,transparent_25%),radial-gradient(circle,#b9daf5_0%,transparent_25%)]" />
      </div>

      <BackgroundOrbs />

      <motion.div
        className="relative z-10 w-130 p-12 rounded-[35px]
        backdrop-blur-[35px] bg-white/30 border border-white/40
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        initial={{ opacity: 0, scale: 0.7, y: 80 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-center text-[#243447]">
          Insurance Portal
        </h1>

        <p className="text-center mt-3 mb-8 text-gray-500">
          Secure access to your policies
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 transition hover:-translate-y-1 hover:shadow-lg">
            <FaEnvelope />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          {/* Password */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 transition hover:-translate-y-1 hover:shadow-lg">
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent outline-none"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <NavLink to={"/forget-password"} className="text-sm text-red-500 flex justify-end hover:text-gray-500 transition hover:scale-105">Forget Password?</NavLink>

          {/* Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full h-15 rounded-xl text-lg font-semibold
            bg-linear-to-r from-[#d2e6ff] to-[#a7ccff] relative overflow-hidden"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              "Login →"
            )}
          </motion.button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </motion.div>

      {/* style for animations */}
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

export default Login;