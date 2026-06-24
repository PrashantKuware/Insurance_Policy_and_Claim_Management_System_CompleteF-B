// import React, { useState } from 'react'
// import { motion } from "framer-motion";
// import './Login.css'
// import { text } from 'framer-motion/client';
// import { addNewProduct } from '../services/ProductService';
// import { useNavigate } from 'react-router-dom';
// import { toast } from "react-toastify";

// const AddProduct = () => {
//     const [formData, setFormData] = useState({
//         productName: "",
//         productType: "",
//         description: ""
//     })

//     const navigate = useNavigate()

//     const handleAddProduct = async (e) => {
//     e.preventDefault();

//     try {

//         await addNewProduct(formData.productName,formData.productType,formData.description);
//         toast.success("Product Added Successfully ✅");
//         navigate("/admindashboard");
//     } catch (error) {
//         console.error(error);
//         toast.error(
//             error.response?.data?.message ||
//             "Failed To Add Product ❌"
//         );
//     }
// }

//     return (
//         <>
//             <div className="container">

//                 <div className="orb orb1"></div>
//                 <div className="orb orb2"></div>
//                 <div className="orb orb3"></div>
//                 <div className="orb orb4"></div>

//                 <motion.div
//                     className="card"
//                     initial={{ opacity: 0, scale: 0.7, y: 80 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     transition={{ duration: 1 }}
//                 >
//                     <motion.h1
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: .5 }}
//                     >
//                         Insurance Portal
//                     </motion.h1>

//                     <p>Add Product</p>

//                     <form onSubmit={handleAddProduct}>

//                         <div className="inputBox">
//                             <input
//                                 type="text"
//                                 placeholder="Enter Product Name"
//                                 value={formData.productName}
//                                 onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
//                                 required
//                             />
//                         </div>

//                         <div className="inputBox">
//                             <select
//                                 value={formData.productType}
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         productType: e.target.value
//                                     })
//                                 }
//                                 required
//                             >
//                                 <option value="">Select Product Type</option>
//                                 <option value="TRAVEL">TRAVEL</option>
//                                 <option value="HEALTH">HEALTH</option>
//                                 <option value="MOTOR">MOTOR</option>
//                                 <option value="LIFE">LIFE</option>
//                             </select>
//                         </div>

//                         <div className="inputBox">
//                             <textarea
//                                 rows="4"
//                                 placeholder="Enter Product Description"
//                                 value={formData.description}
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         description: e.target.value
//                                     })
//                                 }
//                                 required
//                             />
//                         </div>

//                         <motion.button
//                             className="button"
//                             type="submit"
//                             whileHover={{ scale: 1.05, y: -4 }}
//                             whileTap={{ scale: .95 }}
//                         >
//                             Add Product →
//                         </motion.button>

//                     </form>

//                 </motion.div>
//             </div>
//         </>
//     )
// }

// export default AddProduct

import React, { useState } from "react";
import { addNewProduct } from "../services/ProductService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BackgroundOrbs from "./BackgroundOrbs";

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
          error?.message ||
          "Failed To Add Product ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden">

      <BackgroundOrbs />

      {/* CARD */}
      <div className="relative z-10 w-[90%] max-w-[520px] p-10 rounded-[35px]
      backdrop-blur-3xl bg-white/30 border border-white/40 shadow-xl">

        <h1 className="text-4xl font-bold text-center text-[#243447]">
          Insurance Portal
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-6">
          Add Product
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            required
            className="w-full p-4 rounded-xl bg-white/40 outline-none"
            placeholder="Product Name"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
          />

          <select
            required
            className="w-full p-4 rounded-xl bg-white/40 outline-none"
            value={formData.productType}
            onChange={(e) =>
              setFormData({ ...formData, productType: e.target.value })
            }
          >
            <option value="">Select Product Type</option>
            <option value="TRAVEL">TRAVEL</option>
            <option value="HEALTH">HEALTH</option>
            <option value="MOTOR">MOTOR</option>
            <option value="LIFE">LIFE</option>
          </select>

          <textarea
            required
            className="w-full p-4 rounded-xl bg-white/40 outline-none"
            rows={4}
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <button
            className="w-full h-[55px] rounded-xl font-semibold text-lg
            bg-gradient-to-r from-blue-200 to-blue-300 hover:scale-105 transition"
          >
            Add Product →
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;