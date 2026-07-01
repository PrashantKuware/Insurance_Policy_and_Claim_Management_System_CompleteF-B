// import React, { useEffect, useState } from "react";
// import { getAllPoliciesByCustomer } from "../services/policyService";
// import { NavLink } from "react-router-dom";
// import { toast } from "react-toastify";

// const ViewAllPolicies = () => {
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPolicies = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllPoliciesByCustomer();
//       setPolicies(data || []);
//     } catch (error) {
//       toast.error("Failed To Load Policies ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicies();
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-8">
//         <h1 className="text-3xl font-bold mb-6">My Policies</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {[1, 2, 3, 4, 5, 6].map((item) => (
//             <div
//               key={item}
//               className="h-60 rounded-3xl bg-slate-200 animate-pulse"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-4xl font-bold text-slate-800">
//           All Policies
//         </h1>

//         <p className="text-slate-500 mt-2">
//           Manage all your purchased insurance plans
//         </p>
//       </div>

//       {policies.length === 0 ? (
//         <div className="bg-white rounded-3xl p-10 text-center shadow-lg">
//           <h3 className="text-2xl font-semibold text-slate-700">
//             No Policies Found
//           </h3>

//           <p className="text-slate-500 mt-2">
//             Purchase a policy to see it here.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {policies.map((policy) => (
//             <div
//               key={policy.policyId}
//               className="
//               bg-white
//               rounded-3xl
//               p-6
//               border
//               border-slate-200
//               shadow-lg
//               hover:shadow-2xl
//               transition-all
//               "
//             >
//               <div className="flex justify-between items-start mb-5">
//                 <div>
//                   <p className="text-xs uppercase tracking-wider text-slate-400">
//                     Insurance Plan
//                   </p>

//                   <h3 className="text-xl font-bold text-slate-800 mt-2">
//                     {policy.planName}
//                   </h3>
//                 </div>

//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                     policy.policyStatus === "ACTIVE"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {policy.policyStatus}
//                 </span>
//               </div>

//               <div className="space-y-3 text-gray-500">
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Policy ID</span>
//                   <span className="font-semibold">
//                     #{policy.policyId}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Premium Paid</span>
//                   <span className="font-semibold">
//                     ₹{policy.totalPremiumPaid}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Status</span>
//                   <span className="font-semibold">
//                     {policy.policyStatus}
//                   </span>
//                 </div>
//               </div>

//               <NavLink
//                 to={`/policy/${policy.policyId}`}
//                 className="
//                 block
//                 text-center
//                 mt-6
//                 py-3
//                 rounded-xl
//                 bg-blue-600
//                 hover:bg-blue-700
//                 text-white
//                 font-medium
//                 "
//               >
//                 View Details
//               </NavLink>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewAllPolicies;

import React, { useEffect, useState } from "react";
import { getAllPoliciesByCustomer } from "../services/policyService";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Pure micro-interactions aur smooth container transitions ke liye
import { FaShieldAlt, FaCheckCircle, FaClock, FaArrowLeft } from "react-icons/fa";

const ViewAllPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const data = await getAllPoliciesByCustomer();
      setPolicies(data || []);
    } catch (error) {
      toast.error("Failed To Load Policies ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Premium Dark Skeleton Loader Panel
  if (loading) {
    return (
      <div className="space-y-8 p-2">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-slate-800 animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-slate-800/60 rounded-md animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-64 rounded-3xl bg-[#111c30] border border-slate-800/80 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      
      {/* Top Header Section with Quick Navigation Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              All Policies
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Manage and track all your purchased insurance portfolios
            </p>
          </div>
        </div>
      </div>

      {/* Empty State Layout */}
      {policies.length === 0 ? (
        <div className="bg-[#121e36]/40 border border-slate-800/60 rounded-[32px] p-16 text-center max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
              <FaShieldAlt size={44} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">
            No Policies Found
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            You haven't bought any protection plans yet. Explore custom features on dashboard to build assets cover.
          </p>
          <NavLink
            to="/customerdashboard"
            className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs tracking-wide hover:bg-blue-500 transition-all active:scale-95"
          >
            Explore Plans
          </NavLink>
        </div>
      ) : (
        
        /* Interactive Grid Engine Layout with staggered animation hooks */
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
        >
          {policies.map((policy) => (
            <motion.div
              key={policy.policyId}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -6, borderColor: "rgba(59, 130, 246, 0.3)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              className="bg-[#111c30] border border-slate-800/90 rounded-[28px] p-6 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
            >
              {/* Internal Accent Strip */}
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Meta Matrix Row Title */}
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

                {/* Technical Information Details Panel */}
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
                    <span className="text-slate-400 text-xs font-medium">Global Status</span>
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

              {/* Action Trigger Redirection Button */}
              <NavLink
                to={`/policy/${policy.policyId}`}
                className="mt-6 block text-center py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold border border-slate-800/80 hover:bg-blue-600 hover:border-transparent active:scale-98 transition-all shadow-sm"
              >
                View Details
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ViewAllPolicies;