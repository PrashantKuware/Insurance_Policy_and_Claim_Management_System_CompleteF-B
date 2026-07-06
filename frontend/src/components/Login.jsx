import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserShield } from "react-icons/fa";
import { loginUser } from "../services/userService";
import { login } from "../redux/authSlice";
import FormInput from "./common/FormInput";
import PrimaryButton from "./common/PrimaryButton";
import GlassCard from "./common/GlassCard";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const valErrors = {};
    if (!formData.email.trim()) valErrors.email = "Email is required";
    if (!formData.password.trim()) valErrors.password = "Password is required";

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(formData);
      dispatch(login(data));
      toast.success(`Welcome back, ${data.fullName || "User"}! 👋`);

      const role = data.role;
      if (role === "ADMIN") {
        navigate("/admindashboard");
      } else if (role === "AGENT") {
        navigate("/agentdashboard");
      } else {
        navigate("/customerdashboard");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page bg-grid-pattern">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

      <GlassCard className="w-full max-w-md p-8 sm:p-10" hoverable={false}>
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
            <FaUserShield className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
            Insurance Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Access your enterprise dashboard
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <FormInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <div className="flex items-center justify-end text-xs font-bold text-blue-600 dark:text-blue-400">
            <a href="#forgot" className="hover:underline">Forgot password?</a>
          </div>

          <PrimaryButton
            type="submit"
            loading={loading}
            icon={FaSignInAlt}
            className="w-full h-12 shadow-blue-500/10"
          >
            Sign In Account
          </PrimaryButton>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          New client?{" "}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Register profile
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default Login;
