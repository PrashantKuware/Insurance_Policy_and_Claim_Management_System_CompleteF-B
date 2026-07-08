// // // import React, { useEffect, useState } from "react";
// // // import { getAllPoliciesByCustomer } from "../services/policyService";
// // // import { NavLink } from "react-router-dom";
// // // import { toast } from "react-toastify";

// // // const MyPolicies = () => {
// // //   const [policyData, setPolicyData] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   const getMyPolicies = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const data = await getAllPoliciesByCustomer();
// // //       setPolicyData(data || []);
// // //     } catch (error) {
// // //       toast.error("Failed To Load Policies ❌");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     getMyPolicies();
// // //   }, []);

// // //   return (
// // //     <div
// // //       className="
// // //       p-8
// // //       rounded-[32px]
// // //       bg-white/45
// // //       backdrop-blur-2xl
// // //       border border-white/70
// // //       shadow-[0_20px_60px_rgba(0,0,0,0.08)]
// // //       "
// // //     >
// // //       {/* Header */}
// // //       <div className="flex items-center justify-between mb-8">
// // //         <div>
// // //           <h2 className="text-2xl font-bold text-slate-800">
// // //             My Policies
// // //           </h2>

// // //           <p className="text-slate-500 mt-1">
// // //             View and manage your purchased insurance plans
// // //           </p>
// // //         </div>

// // //         <NavLink
// // //           to="/customer/policies"
// // //           className="
// // //           px-5 py-3
// // //           rounded-2xl
// // //           bg-gradient-to-r
// // //           from-blue-500
// // //           to-indigo-600
// // //           text-white
// // //           font-semibold
// // //           shadow-lg
// // //           hover:scale-105
// // //           transition-all
// // //           "
// // //         >
// // //           View All →
// // //         </NavLink>
// // //       </div>

// // //       {/* Loading State */}
// // //       {loading ? (
// // //         <div className="flex gap-6 overflow-x-auto pb-2">
// // //           {[1, 2, 3, 4].map((item) => (
// // //             <div
// // //               key={item}
// // //               className="
// // //               min-w-[280px]
// // //               h-[220px]
// // //               rounded-[28px]
// // //               bg-white/60
// // //               animate-pulse
// // //               "
// // //             />
// // //           ))}
// // //         </div>
// // //       ) : policyData.length === 0 ? (
// // //         <div className="text-center py-12">
// // //           <div className="text-5xl mb-3">📄</div>

// // //           <h3 className="text-xl font-semibold text-slate-700">
// // //             No Policies Found
// // //           </h3>

// // //           <p className="text-slate-500 mt-2">
// // //             Purchase a policy to see it here.
// // //           </p>
// // //         </div>
// // //       ) : (
// // //         <div className="flex gap-6 overflow-x-auto pb-3">
// // //           {policyData.slice(0, 4).map((ele) => (
// // //             <div
// // //               key={ele.policyId}
// // //               className="
// // //               min-w-[240px]
// // //               bg-white/65
// // //               backdrop-blur-2xl
// // //               border border-white/80
// // //               rounded-[28px]
// // //               p-6
// // //               shadow-[0_15px_35px_rgba(0,0,0,0.08)]
// // //               hover:-translate-y-2
// // //               hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)]
// // //               transition-all duration-300
// // //               "
// // //             >
// // //               {/* Top Section */}
// // //               <div className="flex justify-between items-start mb-5">
// // //                 <div>
// // //                   <p className="text-xs uppercase tracking-widest text-slate-500">
// // //                     Insurance Plan
// // //                   </p>

// // //                   <h3 className="text-xl font-bold text-slate-800 mt-2">
// // //                     {ele.planName}
// // //                   </h3>
// // //                 </div>

// // //                 <span
// // //                   className={`px-3 py-1 rounded-full text-xs font-bold ${
// // //                     ele.policyStatus === "ACTIVE"
// // //                       ? "bg-green-100 text-green-700"
// // //                       : "bg-yellow-100 text-yellow-700"
// // //                   }`}
// // //                 >
// // //                   {ele.policyStatus}
// // //                 </span>
// // //               </div>

// // //               {/* Details */}
// // //               <div className="space-y-4 text-sm">
// // //                 <div className="flex justify-between">
// // //                   <span className="text-slate-500">
// // //                     Policy ID
// // //                   </span>

// // //                   <span className="font-semibold text-slate-800">
// // //                     #{ele.policyId}
// // //                   </span>
// // //                 </div>

// // //                 <div className="flex justify-between">
// // //                   <span className="text-slate-500">
// // //                     Premium Paid
// // //                   </span>

// // //                   <span className="font-semibold text-slate-800">
// // //                     ₹{ele.totalPremiumPaid}
// // //                   </span>
// // //                 </div>

// // //                 <div className="flex justify-between">
// // //                   <span className="text-slate-500">
// // //                     Status
// // //                   </span>

// // //                   <span
// // //                     className={`font-semibold ${
// // //                       ele.policyStatus === "ACTIVE"
// // //                         ? "text-green-600"
// // //                         : "text-yellow-600"
// // //                     }`}
// // //                   >
// // //                     {ele.policyStatus}
// // //                   </span>
// // //                 </div>
// // //               </div>

// // //               {/* Button */}
// // //               <NavLink
// // //                 to={`/policy/${ele.policyId}`}
// // //                 className="
// // //                 mt-6
// // //                 block
// // //                 text-center
// // //                 py-3
// // //                 rounded-2xl
// // //                 bg-gradient-to-r
// // //                 from-blue-500
// // //                 to-indigo-600
// // //                 text-white
// // //                 font-semibold
// // //                 hover:opacity-90
// // //                 transition-all
// // //                 "
// // //               >
// // //                 View Details
// // //               </NavLink>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default MyPolicies;

// // import React, { useEffect, useState } from "react";
// // import { getAllPoliciesByCustomer } from "../services/policyService";
// // import { NavLink } from "react-router-dom";
// // import { toast } from "react-toastify";
// // import {
// //   FaShieldAlt,
// //   FaArrowRight,
// //   FaCheckCircle,
// //   FaClock,
// // } from "react-icons/fa";

// // const MyPolicies = () => {
// //   const [policyData, setPolicyData] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const getMyPolicies = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getAllPoliciesByCustomer();
// //       setPolicyData(data || []);
// //     } catch (error) {
// //       toast.error("Failed To Load Policies ❌");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     getMyPolicies();
// //   }, []);

// //   return (
// //     <section className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
      
// //       {/* Header */}
// //       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-slate-100">
        
// //         <div>
// //           <h2 className="text-2xl font-bold text-slate-800">
// //             My Policies
// //           </h2>

// //           <p className="text-slate-500 mt-1">
// //             View and manage your purchased insurance plans
// //           </p>
// //         </div>

// //         <NavLink
// //           to="/customerdashboard"
// //           className="
// //           inline-flex items-center gap-2
// //           px-5 py-3
// //           rounded-xl
// //           bg-blue-600
// //           text-white
// //           font-medium
// //           hover:bg-blue-700
// //           transition
// //           "
// //         >
// //           View All
// //           <FaArrowRight />
// //         </NavLink>
// //       </div>

// //       {/* Loading */}
// //       {loading ? (
// //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
// //           {[1, 2, 3].map((item) => (
// //             <div
// //               key={item}
// //               className="
// //               h-64
// //               rounded-2xl
// //               bg-slate-200
// //               animate-pulse
// //               "
// //             />
// //           ))}
// //         </div>
// //       ) : policyData.length === 0 ? (
// //         <div className="py-16 text-center">
          
// //           <div className="flex justify-center mb-4">
// //             <FaShieldAlt
// //               size={50}
// //               className="text-slate-300"
// //             />
// //           </div>

// //           <h3 className="text-xl font-semibold text-slate-700">
// //             No Policies Found
// //           </h3>

// //           <p className="text-slate-500 mt-2">
// //             Purchase a policy to start building your insurance portfolio.
// //           </p>
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
          
// //           {policyData.slice(0, 3).map((policy) => (
// //             <div
// //               key={policy.policyId}
// //               className="
// //               bg-gradient-to-br
// //               from-white
// //               to-slate-50
// //               border border-slate-200
// //               rounded-3xl
// //               p-6
// //               shadow-sm
// //               hover:shadow-xl
// //               hover:-translate-y-1
// //               transition-all duration-300
// //               "
// //             >
// //               <div className="flex justify-between items-start mb-5">
                
// //                 <div>
// //                   <p className="text-xs uppercase tracking-wider text-slate-400">
// //                     Insurance Plan
// //                   </p>

// //                   <h3 className="font-bold text-xl text-slate-800 mt-2">
// //                     {policy.planName}
// //                   </h3>
// //                 </div>

// //                 <span
// //                   className={`
// //                     flex items-center gap-1
// //                     px-3 py-1
// //                     rounded-full
// //                     text-xs font-semibold
// //                     ${
// //                       policy.policyStatus === "ACTIVE"
// //                         ? "bg-green-100 text-green-700"
// //                         : "bg-yellow-100 text-yellow-700"
// //                     }
// //                   `}
// //                 >
// //                   {policy.policyStatus === "ACTIVE" ? (
// //                     <FaCheckCircle />
// //                   ) : (
// //                     <FaClock />
// //                   )}

// //                   {policy.policyStatus}
// //                 </span>
// //               </div>

// //               <div className="space-y-3 text-sm">
                
// //                 <div className="flex justify-between">
// //                   <span className="text-slate-500">
// //                     Policy ID
// //                   </span>

// //                   <span className="font-semibold text-slate-800">
// //                     #{policy.policyId}
// //                   </span>
// //                 </div>

// //                 <div className="flex justify-between">
// //                   <span className="text-slate-500">
// //                     Premium Paid
// //                   </span>

// //                   <span className="font-semibold text-slate-800">
// //                     ₹{policy.totalPremiumPaid}
// //                   </span>
// //                 </div>

// //                 <div className="flex justify-between">
// //                   <span className="text-slate-500">
// //                     Status
// //                   </span>

// //                   <span
// //                     className={`font-semibold ${
// //                       policy.policyStatus === "ACTIVE"
// //                         ? "text-green-600"
// //                         : "text-yellow-600"
// //                     }`}
// //                   >
// //                     {policy.policyStatus}
// //                   </span>
// //                 </div>
// //               </div>

// //               <NavLink
// //                 to={`/policy/${policy.policyId}`}
// //                 className="
// //                 mt-6
// //                 block
// //                 text-center
// //                 py-3
// //                 rounded-xl
// //                 bg-slate-900
// //                 text-white
// //                 font-medium
// //                 hover:bg-slate-800
// //                 transition
// //                 "
// //               >
// //                 View Details
// //               </NavLink>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </section>
// //   );
// // };

// // export default MyPolicies;

// import React, { useEffect, useState } from "react";
// import { getAllPoliciesByCustomer } from "../services/policyService";
// import { NavLink } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion"; // Dynamic premium animations ke liye
// import {
//   FaShieldAlt,
//   FaArrowRight,
//   FaCheckCircle,
//   FaClock,
// } from "react-icons/fa";

// const MyPolicies = () => {
//   const [policyData, setPolicyData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getMyPolicies = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllPoliciesByCustomer();
//       setPolicyData(data || []);
//     } catch (error) {
//       toast.error("Failed To Load Policies ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getMyPolicies();
//   }, []);

//   return (
//     <section className="bg-white/40 backdrop-blur-3xl rounded-[32px] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
      
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-8 border-b border-white/40 bg-white/20">
//         <div>
//           <h2 className="text-2xl font-bold text-[#243447]">
//             My Policies
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">
//             View and manage your purchased insurance plans
//           </p>
//         </div>

//         <NavLink
//           to="/customer/policies"
//           className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:opacity-95 active:scale-95 transition-all"
//         >
//           View All
//           <FaArrowRight className="text-xs" />
//         </NavLink>
//       </div>

//       {/* Main Body content area */}
//       <div className="p-8">
//         {/* Loading Skeleton */}
//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {[1, 2, 3].map((item) => (
//               <div
//                 key={item}
//                 className="h-64 rounded-3xl bg-slate-200/60 border border-white animate-pulse"
//               />
//             ))}
//           </div>
//         ) : policyData.length === 0 ? (
//           /* Empty State Dashboard Window */
//           <div className="py-16 text-center max-w-sm mx-auto">
//             <div className="flex justify-center mb-4">
//               <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-500">
//                 <FaShieldAlt size={40} />
//               </div>
//             </div>
//             <h3 className="text-lg font-bold text-[#243447]">
//               No Policies Found
//             </h3>
//             <p className="text-gray-500 text-sm mt-2 leading-relaxed">
//               Purchase a policy to start building your dynamic secure insurance portfolio today.
//             </p>
//           </div>
//         ) : (
//           /* Cards Grid Wrapper with Framer motion entry hook */
//           <motion.div 
//             className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, staggerChildren: 0.1 }}
//           >
//             {policyData.slice(0, 3).map((policy) => (
//               <motion.div
//                 key={policy.policyId}
//                 whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }}
//                 className="bg-white/70 border border-white/80 rounded-3xl p-6 flex flex-col justify-between transition-shadow duration-300 relative group overflow-hidden shadow-sm"
//               >
//                 {/* Visual Accent glow line inside card */}
//                 <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-300 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />

//                 <div>
//                   {/* Card Title Header details */}
//                   <div className="flex justify-between items-start mb-6 gap-2">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
//                         Insurance Plan
//                       </p>
//                       <h3 className="font-extrabold text-lg text-slate-800 mt-1 line-clamp-1">
//                         {policy.planName}
//                       </h3>
//                     </div>

//                     <span
//                       className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm shrink-0 ${
//                         policy.policyStatus === "ACTIVE"
//                           ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
//                           : "bg-amber-50 text-amber-600 border border-amber-200"
//                       }`}
//                     >
//                       {policy.policyStatus === "ACTIVE" ? (
//                         <FaCheckCircle className="text-xs" />
//                       ) : (
//                         <FaClock className="text-xs" />
//                       )}
//                       {policy.policyStatus}
//                     </span>
//                   </div>

//                   {/* Policy core metric rows */}
//                   <div className="space-y-3 text-sm border-t border-slate-100/80 pt-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-400 text-xs font-medium">Policy ID</span>
//                       <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded-md">
//                         #{policy.policyId}
//                       </span>
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-400 text-xs font-medium">Premium Paid</span>
//                       <span className="font-bold text-slate-800 text-md">
//                         ₹{Number(policy.totalPremiumPaid).toLocaleString("en-IN")}
//                       </span>
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-400 text-xs font-medium">Status</span>
//                       <span
//                         className={`text-xs font-bold ${
//                           policy.policyStatus === "ACTIVE"
//                             ? "text-emerald-600"
//                             : "text-amber-600"
//                         }`}
//                       >
//                         ● {policy.policyStatus}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Card Action Link Trigger */}
//                 <NavLink
//                   to={`/policy/${policy.policyId}`}
//                   className="mt-6 block text-center py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-98 transition-all shadow-sm"
//                 >
//                   View Details
//                 </NavLink>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default MyPolicies;

import React, { useEffect, useState } from "react";
import { getAllPoliciesByCustomer } from "../services/policyService";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Staggered fluid micro-interactions
import {
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const MyPolicies = () => {
  const [policyData, setPolicyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyPolicies = async () => {
    try {
      setLoading(true);
      const data = await getAllPoliciesByCustomer();
      setPolicyData(data || []);
    } catch (error) {
      toast.error("Failed To Load Policies ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyPolicies();
  }, []);

  return (
    <section className="bg-[#111c30] rounded-[32px] border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-8 border-b border-slate-800/60 bg-slate-900/40">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            My Policies
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            View and manage your purchased insurance plans
          </p>
        </div>

        <NavLink
          to="/customer/policies"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/10 hover:opacity-95 active:scale-95 transition-all"
        >
          View All
          <FaArrowRight className="text-xs" />
        </NavLink>
      </div>

      {/* Main Body content area */}
      <div className="p-8">
        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 rounded-3xl bg-[#121e36] border border-slate-800/50 animate-pulse"
              />
            ))}
          </div>
        ) : policyData.length === 0 ? (
          /* Empty State Dashboard Window */
          <div className="py-12 text-center max-w-sm mx-auto">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
                <FaShieldAlt size={40} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">
              No Policies Found
            </h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Purchase a policy to start building your dynamic secure insurance portfolio today.
            </p>
          </div>
        ) : (
          /* Cards Grid Wrapper with Framer motion entry hook */
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.08 }}
          >
            {policyData.slice(0, 3).map((policy) => (
              <motion.div
                key={policy.policyId}
                whileHover={{ y: -6, borderColor: "rgba(59, 130, 246, 0.3)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                className="bg-[#121e36]/60 border border-slate-800/90 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden shadow-sm"
              >
                {/* Visual Accent glow line inside card */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Card Title Header details */}
                  <div className="flex justify-between items-start mb-6 gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                        Insurance Plan
                      </p>
                      <h3 className="font-extrabold text-lg text-white mt-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {policy.planName}
                      </h3>
                    </div>

                    <span
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 shadow-sm ${
                        policy.policyStatus === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {policy.policyStatus === "ACTIVE" ? (
                        <FaCheckCircle className="text-xs" />
                      ) : (
                        <FaClock className="text-xs" />
                      )}
                      {policy.policyStatus}
                    </span>
                  </div>

                  {/* Policy core metric rows */}
                  <div className="space-y-3.5 text-sm border-t border-slate-800/60 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-medium">Policy ID</span>
                      <span className="font-mono text-xs font-bold text-slate-300 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-md">
                        #{policy.policyId}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-medium">Premium Paid</span>
                      <span className="font-bold text-white text-md">
                        ₹{Number(policy.totalPremiumPaid).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-medium">Status</span>
                      <span
                        className={`text-xs font-bold ${
                          policy.policyStatus === "ACTIVE"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        ● {policy.policyStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Link Trigger */}
                <NavLink
                  to={`/policy/${policy.policyId}`}
                  className="mt-6 block text-center py-3 rounded-xl bg-[#0b1426] text-white text-xs font-semibold border border-slate-800 hover:bg-blue-600 hover:border-transparent active:scale-98 transition-all shadow-sm"
                >
                  View Details
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MyPolicies;