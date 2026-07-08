// // import CustomerLayout from "../components/CustomerLayaout";
// // import MyPolicies from "../components/MyPolicies";
// // import Product from "../components/Product";

// // const CustomerDashboard = () => {
// //   return (
// //     <CustomerLayout>
// //       <div className="relative">


// //         <div className="relative z-10 space-y-10 text-white">

// //           <div>
// //             <h1 className="text-4xl font-bold text-[#243447]">
// //               Customer Dashboard
// //             </h1>

// //             <p className="text-gray-600 mt-2">
// //               Manage your policies & explore plans
// //             </p>
// //           </div>

// //           <section>
// //             <MyPolicies />
// //           </section>

// //           <section>
// //             <Product />
// //           </section>

// //         </div>

// //       </div>
// //     </CustomerLayout>
// //   );
// // };

// // export default CustomerDashboard;

// import CustomerLayout from "../components/CustomerLayaout";
// import MyPolicies from "../components/MyPolicies";
// import Product from "../components/Product";
// import {
//   FaShieldAlt,
//   FaFileInvoiceDollar,
//   FaCheckCircle,
// } from "react-icons/fa";

// const CustomerDashboard = () => {
//   return (
//     <CustomerLayout>
//       <div className="space-y-8">

//         <div>
//           <h1 className="text-4xl font-bold text-slate-800">
//             Customer Dashboard
//           </h1>

//           <p className="text-slate-500 mt-2">
//             Manage your policies and explore insurance plans
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//           <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
//             <FaShieldAlt className="text-blue-600 text-3xl mb-3" />
//             <h3 className="text-slate-500">Active Policies</h3>
//             <p className="text-3xl font-bold text-slate-800">--</p>
//           </div>

//           <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
//             <FaFileInvoiceDollar className="text-indigo-600 text-3xl mb-3" />
//             <h3 className="text-slate-500">Claims</h3>
//             <p className="text-3xl font-bold text-slate-800">--</p>
//           </div>

//           <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
//             <FaCheckCircle className="text-green-600 text-3xl mb-3" />
//             <h3 className="text-slate-500">Approved</h3>
//             <p className="text-3xl font-bold text-slate-800">--</p>
//           </div>

//         </div>

//         <section>
//           <MyPolicies />
//         </section>

//         <section>
//           <Product />
//         </section>

//       </div>
//     </CustomerLayout>
//   );
// };

// export default CustomerDashboard;

import React, { useEffect, useState } from "react";
import CustomerLayout from "../components/CustomerLayaout";
import MyPolicies from "../components/MyPolicies";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion"; // Animation integration
import { toast } from "react-toastify";
import {
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaCheckCircle,
} from "react-icons/fa";
import { getClaimByPolicyId } from "../services/claimService";
import { getAllPoliciesByCustomer } from "../services/policyService";
import Marquee from "../components/Marquee";
import Card from "../components/Card";
import { getAllPolicy } from "../services/PlanServices";
import { getCurrentUser } from "../services/userService";

// Image references context placeholders (Aap yahan apni static assets ya URLs add kar sakte hain)
const productItems = [
  {
    productType: "HEALTH",
    title: "Health Insurance",
    price: "₹5,000/year",
    image: "https://img.magnific.com/premium-photo/health-insurance-isolated-cartoon_1073912-521.jpg?w=2000",
  },
  {
    productType: "MOTOR",
    title: "Motar Insurance",
    price: "₹10,000/year",
    image: "https://finoplus.in/wp-content/uploads/2022/06/Motor-Insurance.png",
  },
  {
    productType: "LIFE",
    title: "Life Insurance",
    price: "₹8,000/year",
    image: "https://kurakulas.com/assets/img/life-insurance.jpg",
  },
  {
    productType: "TRAVEL",
    title: "Travel Insurance",
    price: "₹5,000/year",
    image: "https://finoplus.in/wp-content/uploads/2022/06/Travel-Insurance.png",
  },
];

const CustomerDashboard = () => {
  const [stats, setStats] = useState({
    activePolicies: 0,
    approvedClaims: 0,
    claimsFiled: 0,
  });
  const [plan, setPlan] = useState([])
  const [currUser, setCurrUser] = useState("")


  const loadDashboardStats = async () => {
    try {
      const policies = await getAllPoliciesByCustomer();

      let activePolicies = 0;
      let approvedClaims = 0;
      let claimsFiled = 0;

      for (const policy of policies) {
        if (policy.policyStatus === "ACTIVE") {
          activePolicies++;
        }

        try {
          const claimResponse = await getClaimByPolicyId(policy.policyId);
          const claims = claimResponse?.content || [];

          claimsFiled += claims.length;

          approvedClaims += claims.filter(
            (claim) => claim.claimStatus === "APPROVED"
          ).length;
        } catch (err) {
          console.log("Claim fetch failed", err);
        }
      }

      setStats({
        activePolicies,
        approvedClaims,
        claimsFiled,
      });
    } catch (error) {
      toast.error("Failed To Load Dashboard Stats");
      console.log(error)
    }
  };

  const getAllPlans = async () => {
    try {
      const data = await getAllPolicy();

      console.log("FULL RESPONSE:", data);

      setPlan(data?.content || []); // 🔥 IMPORTANT FIX

    } catch (error) {
      console.log(error);
    }
  };

  const getCurrUser = async () => {
    try {
      const data = await getCurrentUser();

      setCurrUser(data)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadDashboardStats();
    getAllPlans()
    getCurrUser()
  }, []);
  return (
    <CustomerLayout>
      {/* Container Wrapper with full dark mode card tint matching the image reference */}
      <motion.div
        className="space-y-10 p-8 rounded-[35px] bg-[#0b1426] text-white border border-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.4)]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Dashboard Heading Header layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800/60 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              {currUser?.fullName} Dashboard
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              Manage your active portfolio, tracks claims & discover protective measures.
            </p>
          </div>
        </div>

        {/* Stats Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-[#121e36] rounded-2xl p-6 border border-slate-800/80 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex gap-3">
              <FaShieldAlt className="text-blue-400 text-3xl mb-4" />
              <p className="text-slate-400 text-2xl">Active Policies</p>
            </div>
            <h2 className="text-4xl font-bold text-white mt-2">
              {stats.activePolicies}
            </h2>
          </div>

          <div className="bg-[#121e36] rounded-2xl p-6 border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex gap-3">
              <FaFileInvoiceDollar className="text-indigo-400 text-3xl mb-4" />
              <p className="text-slate-400 text-2xl">Approved Claims</p>
            </div>
            <h2 className="text-4xl font-bold text-emerald-400 mt-2">
              {stats.approvedClaims}
            </h2>
          </div>

          <div className="bg-[#121e36] rounded-2xl p-6 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex gap-3">
              <FaCheckCircle className="text-emerald-400 text-3xl mb-4" />
              <p className="text-slate-400 text-2xl">Claims Filed</p>
            </div>
            <h2 className="text-4xl font-bold text-blue-400 mt-2">
              {stats.claimsFiled}
            </h2>
          </div>
        </div>
        {/* // idar tau */}
        <section className="bg-[#121e36]/40 rounded-[28px] p-2 text-blue-400 border border-slate-800/40 w-[70vw]">
          <h2 className="text-2xl font-bold pl-5 py-4 text-white mb-2">
            Available Insurance Policies
          </h2>
          <p className="text-slate-400 pl-5 mb-4">
            Select a plan that fits your needs and secure your future today
          </p>
          <Marquee pauseOnHover reverse>
            {plan.map((item) => (
              <Card key={item.planId} plan={item} />
            ))}
          </Marquee>
          <Marquee pauseOnHover>
            {plan.map((item) => (
              <Card key={item.planId} plan={item} />
            ))}
          </Marquee>
        </section>

        {/* Dynamic My Policies Section Component */}
        <section className="bg-[#121e36]/40 rounded-[28px] p-2 border border-slate-800/40">
          <MyPolicies />
        </section>

        {/* --- PREMIUM REPLACED PRODUCT SECTION START --- */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-wide text-white">
              Available Insurance Products
            </h2>
            <NavLink
              to="/customer/product"
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-all"
            >
              View All
            </NavLink>
          </div>

          {/* Cards Row grid panel with slide up fade entrance layout mapping */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {productItems.map((item) => (
              <motion.div
                key={item.productType}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="bg-[#111c30] border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between group hover:border-slate-700 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
              >
                {/* Image Section block wrapper */}
                <div className="w-full h-40 rounded-xl overflow-hidden mb-4 relative bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111c30] via-transparent to-transparent opacity-60" />
                </div>

                {/* Content details meta section */}
                <div className="space-y-1 mb-5 px-1">
                  <h3 className="font-bold text-md text-white group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Starting at <span className="text-slate-300 font-medium">{item.price}</span>
                  </p>
                </div>

                {/* Action button trigger container redirection */}
                <NavLink
                  to={`/customer/product/${item.productType}`}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/20 font-semibold text-xs tracking-wide group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                >
                  View Products
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        </section>
        {/* --- PREMIUM REPLACED PRODUCT SECTION END --- */}

      </motion.div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;