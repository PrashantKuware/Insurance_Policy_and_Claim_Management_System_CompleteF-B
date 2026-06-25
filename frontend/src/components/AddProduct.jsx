import React, { useState } from "react";
import { addNewProduct } from "../services/ProductService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    description: "",
  });

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

    const loading = toast.loading("Adding Product...");

    try {
      await addNewProduct(
        formData.productName,
        formData.productType,
        formData.description
      );

      toast.update(loading, {
        render: "Product Added Successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      navigate("/admindashboard");
    } catch (error) {
      toast.update(loading, {
        render:
          error?.response?.data?.message ||
          "Failed To Add Product ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 animate-spin-slow opacity-40">
        <div className="w-[200%] h-[200%] bg-[radial-gradient(circle,#dcefff_0%,transparent_25%),radial-gradient(circle,#b9daf5_0%,transparent_25%)]" />
      </div>

      {/* Floating Orbs */}
      <BackgroundOrbs />

      {/* Animated Card */}
      <motion.div
        className="relative z-10 w-[90%] max-w-[520px] p-10 rounded-[35px]
        backdrop-blur-[35px] bg-white/30 border border-white/40
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        initial={{ opacity: 0, scale: 0.7, y: 80 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl font-bold text-center text-[#243447]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Insurance Portal
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 mt-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Add Product
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="p-4 rounded-xl bg-white/40 transition hover:-translate-y-1 hover:shadow-lg">
            <input
              type="text"
              placeholder="Product Name"
              className="w-full bg-transparent outline-none"
              value={formData.productName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productName: e.target.value,
                })
              }
            />
          </div>

          <div className="p-4 rounded-xl bg-white/40 transition hover:-translate-y-1 hover:shadow-lg">
            <select
              className="w-full bg-transparent outline-none"
              value={formData.productType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productType: e.target.value,
                })
              }
            >
              <option value="">Select Product Type</option>
              <option value="TRAVEL">TRAVEL</option>
              <option value="HEALTH">HEALTH</option>
              <option value="MOTOR">MOTOR</option>
              <option value="LIFE">LIFE</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-white/40 transition hover:-translate-y-1 hover:shadow-lg">
            <textarea
              rows={4}
              placeholder="Product Description"
              className="w-full bg-transparent outline-none resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <motion.button
            type="submit"
            className="w-full h-15 rounded-xl text-lg font-semibold
            bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff]
            relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Product →
          </motion.button>
        </form>
      </motion.div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          50% {
            transform: translateY(-30px) rotate(10deg);
          }
        }

        @keyframes spinSlow {
          100% {
            transform: rotate(360deg);
          }
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

        .orb1 {
          width: 320px;
          height: 320px;
          top: -60px;
          left: 30%;
        }

        .orb2 {
          width: 150px;
          height: 150px;
          top: 15%;
          right: 20%;
          animation-delay: 2s;
        }

        .orb3 {
          width: 220px;
          height: 220px;
          bottom: 15%;
          left: 10%;
          animation-delay: 1s;
        }

        .orb4 {
          width: 180px;
          height: 180px;
          bottom: 10%;
          right: 10%;
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;