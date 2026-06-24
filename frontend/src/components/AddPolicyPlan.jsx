// import React, { useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { addNewPlanPolicy } from '../services/PlanServices';
// import { motion } from "framer-motion";
// import './Login.css'
// import { toast } from "react-toastify";

// const AddPolicyPlan = () => {

//     const [formData, setFormData] = useState({
//         planName: "",
//         coverageAmount: "",
//         premiumAmount: "",
//         premiumType: "",
//         duration: "",
//         termsConditions: ""
//     });

//     const [loading, setLoading] = useState(false);

//     const navigate = useNavigate();
//     const { productId } = useParams();

//     const handleAppPolicy = async (e) => {

//         e.preventDefault();

//         try {

//             setLoading(true);

//             const res = await addNewPlanPolicy(
//                 productId,
//                 formData.planName,
//                 formData.coverageAmount,
//                 formData.premiumAmount,
//                 formData.premiumType,
//                 formData.duration,
//                 formData.termsConditions
//             );

//             console.log(res);

//             toast.success("Policy Plan Added Successfully ✅");

//             setTimeout(() => {
//                 navigate("/admindashboard");
//             }, 1000);

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Failed To Add Policy Plan ❌"
//             );

//         } finally {
//             setLoading(false);
//         }
//     };

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

//                     <p>Add Policy</p>

//                     <form onSubmit={handleAppPolicy}>

//                         <div className="inputBox">
//                             <input
//                                 type="text"
//                                 placeholder="Plan Name"
//                                 value={formData.planName}
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         planName: e.target.value
//                                     })
//                                 }
//                                 required
//                             />
//                         </div>

//                         <div className="doubleInput">

//                             <div className="inputBox">
//                                 <input
//                                     type="number"
//                                     placeholder="Coverage Amount"
//                                     value={formData.coverageAmount}
//                                     onChange={(e) =>
//                                         setFormData({
//                                             ...formData,
//                                             coverageAmount: e.target.value
//                                         })
//                                     }
//                                     required
//                                 />
//                             </div>

//                             <div className="inputBox">
//                                 <input
//                                     type="number"
//                                     placeholder="Premium Amount"
//                                     value={formData.premiumAmount}
//                                     onChange={(e) =>
//                                         setFormData({
//                                             ...formData,
//                                             premiumAmount: e.target.value
//                                         })
//                                     }
//                                     required
//                                 />
//                             </div>

//                         </div>

//                         <div className="inputBox">
//                             <input
//                                 type="number"
//                                 placeholder="Enter Duration"
//                                 value={formData.duration}
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         duration: e.target.value
//                                     })
//                                 }
//                                 required
//                             />
//                         </div>

//                         <div className="inputBox">
//                             <select
//                                 value={formData.premiumType}
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         premiumType: e.target.value
//                                     })
//                                 }
//                                 required
//                             >
//                                 <option value="">Select Premium Type</option>
//                                 <option value="ANNUAL">ANNUAL</option>
//                                 <option value="ONE_TIME">ONE_TIME</option>
//                             </select>
//                         </div>

//                         <div className="inputBox">
//                             <textarea
//                                 rows="4"
//                                 placeholder="Terms & Conditions"
//                                 value={formData.termsConditions}
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         termsConditions: e.target.value
//                                     })
//                                 }
//                                 required
//                             />
//                         </div>

//                         <motion.button
//                             className="button"
//                             type="submit"
//                             disabled={loading}
//                             whileHover={{ scale: 1.05, y: -4 }}
//                             whileTap={{ scale: .95 }}
//                         >
//                             {loading ? "Adding..." : "Add Plan →"}
//                         </motion.button>

//                     </form>

//                 </motion.div>
//             </div>
//         </>
//     );
// }

// export default AddPolicyPlan;

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addNewPlanPolicy } from "../services/PlanServices";
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
    <div className="relative min-h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden">

      {/* ORBS */}
      <div className="absolute w-[320px] h-[320px] bg-blue-200/50 rounded-full blur-3xl top-[-60px] left-[30%]" />
      <div className="absolute w-[150px] h-[150px] bg-blue-300/40 rounded-full blur-2xl top-[15%] right-[20%]" />
      <div className="absolute w-[220px] h-[220px] bg-blue-200/40 rounded-full blur-3xl bottom-[15%] left-[10%]" />
      <div className="absolute w-[180px] h-[180px] bg-blue-300/40 rounded-full blur-2xl bottom-[10%] right-[10%]" />

      {/* CARD */}
      <div className="relative z-10 w-[90%] max-w-[520px] p-10 rounded-[35px]
      backdrop-blur-3xl bg-white/30 border border-white/40 shadow-xl">

        <h1 className="text-4xl font-bold text-center text-[#243447]">
          Insurance Portal
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-6">
          Add Policy Plan
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="w-full p-4 rounded-xl bg-white/40 outline-none"
            placeholder="Plan Name"
            required
            value={formData.planName}
            onChange={(e) =>
              setFormData({ ...formData, planName: e.target.value })
            }
          />

          <div className="flex gap-3">
            <input
              className="w-full p-4 rounded-xl bg-white/40 outline-none"
              type="number"
              required
              placeholder="Coverage"
              value={formData.coverageAmount}
              onChange={(e) =>
                setFormData({ ...formData, coverageAmount: e.target.value })
              }
            />

            <input
              className="w-full p-4 rounded-xl bg-white/40 outline-none"
              type="number"
              required
              placeholder="Premium"
              value={formData.premiumAmount}
              onChange={(e) =>
                setFormData({ ...formData, premiumAmount: e.target.value })
              }
            />
          </div>

          <input
            className="w-full p-4 rounded-xl bg-white/40 outline-none"
            type="number"
            placeholder="Duration"
            required
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />

          <select
            className="w-full p-4 rounded-xl bg-white/40 outline-none"
            value={formData.premiumType}
            required
            onChange={(e) =>
              setFormData({ ...formData, premiumType: e.target.value })
            }
          >
            <option value="">Select Premium Type</option>
            <option value="ANNUAL">ANNUAL</option>
            <option value="ONE_TIME">ONE_TIME</option>
          </select>

          <textarea
            className="w-full p-4 rounded-xl bg-white/40 outline-none"
            rows={4}
            required
            placeholder="Terms & Conditions"
            value={formData.termsConditions}
            onChange={(e) =>
              setFormData({ ...formData, termsConditions: e.target.value })
            }
          />

          <button
            disabled={loading}
            className="w-full h-[55px] rounded-xl font-semibold text-lg
            bg-gradient-to-r from-blue-200 to-blue-300 hover:scale-105 transition"
          >
            {loading ? "Adding..." : "Add Plan →"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddPolicyPlan;