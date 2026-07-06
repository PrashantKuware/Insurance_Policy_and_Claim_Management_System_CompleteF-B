import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { sendEmailOtp, sendMobileOtp, registerUser } from "../services/userService";
import FormInput from "./common/FormInput";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import GlassCard from "./common/GlassCard";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  const [mobileTimer, setMobileTimer] = useState(0);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    emailOtp: "",
    mobileOtp: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

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

  const handleSendEmailOtp = async () => {
    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required to send OTP" }));
      return;
    }
    try {
      await sendEmailOtp(formData.email);
      toast.success("Email OTP sent successfully 🚀");
      startTimer(setEmailTimer);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send email OTP");
    }
  };

  const handleSendMobileOtp = async () => {
    if (!formData.mobileNumber.trim()) {
      setErrors((prev) => ({ ...prev, mobileNumber: "Mobile number is required to send OTP" }));
      return;
    }
    try {
      await sendMobileOtp(formData.mobileNumber);
      toast.success("Mobile OTP sent successfully 🚀");
      startTimer(setMobileTimer);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send mobile OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valErrors = {};
    if (!formData.fullName.trim()) valErrors.fullName = "Full name is required";
    if (!formData.email.trim()) valErrors.email = "Email is required";
    if (!formData.mobileNumber.trim()) valErrors.mobileNumber = "Mobile number is required";
    if (!formData.password.trim()) valErrors.password = "Password is required";
    if (!formData.emailOtp.trim()) valErrors.emailOtp = "Email OTP is required";
    if (!formData.mobileOtp.trim()) valErrors.mobileOtp = "Mobile OTP is required";

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData);
      toast.success("Registration successful! Please log in.");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed. Check OTPs or details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page bg-grid-pattern">
      <GlassCard className="w-full max-w-xl p-8 sm:p-10" hoverable={false}>
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
            <FaArrowLeft className="w-4 h-4" />
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
            Register Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Full Name"
            id="fullName"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-3">
            <FormInput
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              className="md:col-span-2"
              required
            />
            <SecondaryButton
              type="button"
              disabled={emailTimer > 0}
              onClick={handleSendEmailOtp}
              className="w-full h-11 text-xs font-bold"
            >
              {emailTimer > 0 ? `Resend (${emailTimer}s)` : "Send OTP"}
            </SecondaryButton>
          </div>

          <FormInput
            label="Email OTP"
            id="emailOtp"
            name="emailOtp"
            placeholder="6-digit verification code"
            value={formData.emailOtp}
            onChange={handleChange}
            error={errors.emailOtp}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-3">
            <FormInput
              label="Mobile Number"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="9876543210"
              value={formData.mobileNumber}
              onChange={handleChange}
              error={errors.mobileNumber}
              className="md:col-span-2"
              required
            />
            <SecondaryButton
              type="button"
              disabled={mobileTimer > 0}
              onClick={handleSendMobileOtp}
              className="w-full h-11 text-xs font-bold"
            >
              {mobileTimer > 0 ? `Resend (${mobileTimer}s)` : "Send OTP"}
            </SecondaryButton>
          </div>

          <FormInput
            label="Mobile OTP"
            id="mobileOtp"
            name="mobileOtp"
            placeholder="6-digit verification code"
            value={formData.mobileOtp}
            onChange={handleChange}
            error={errors.mobileOtp}
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

          <PrimaryButton
            type="submit"
            loading={loading}
            icon={FaUserPlus}
            className="w-full h-12 mt-6"
          >
            Register Profile
          </PrimaryButton>
        </form>
      </GlassCard>
    </div>
  );
};

export default Register;
