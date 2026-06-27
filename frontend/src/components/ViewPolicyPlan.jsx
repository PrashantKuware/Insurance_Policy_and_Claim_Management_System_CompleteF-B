// import React, { useEffect, useState } from 'react'
// import { getPolicyByProductId } from '../services/PlanServices'
// import { NavLink, useParams } from 'react-router-dom'
// import "./Product.css"
// import usePolicyByProductId from '../hooks/usePolicyByProductId'
// import { useSelector } from 'react-redux'

// const ViewPolicyPlan = () => {

//     const { productId } = useParams();

//     let {
//         policyData,
//         loading,
//         error,
//         refreshPolicies
//     } = usePolicyByProductId(productId);

//     const role = useSelector(
//         (state) => state.auth.role
//     );


//     if (role === "CUSTOMER") {
//         policyData = policyData.filter((ele) => {
//             return ele.active === true
//         })
//     }


//     if (loading) return <h1>Loading...</h1>;

//     if (error) return <h1>Error</h1>;

//     return (
//         <div className="dashboardContainer">

//             <div className="orb orb1"></div>
//             <div className="orb orb2"></div>
//             <div className="orb orb3"></div>
//             <div className="orb orb4"></div>

//             <div className="dashboardContent">

//                 <h1 className="dashboardTitle">
//                     Policy Plans
//                 </h1>

//                 <div className="productGrid">

//                     {
//                         policyData.length > 0 ?

//                             policyData.map((ele) => (

//                                 <div
//                                     key={ele.planId}
//                                     className="productCard"
//                                 >

//                                     <div className="badge">
//                                         {ele.premiumType}
//                                     </div>

//                                     <h2>
//                                         {ele.planName}
//                                     </h2>

//                                     <p>
//                                         Product : {ele.productName}
//                                     </p>

//                                     <p>
//                                         Coverage :
//                                         ₹{ele.coverageAmount}
//                                     </p>

//                                     <p>
//                                         Premium :
//                                         ₹{ele.premiumAmount}
//                                     </p>

//                                     <p>
//                                         Duration :
//                                         {ele.duration} Years
//                                     </p>

//                                     <p>
//                                         Status :
//                                         {
//                                             ele.active
//                                                 ? " Active"
//                                                 : " Inactive"
//                                         }
//                                     </p>

//                                     <p>
//                                         {ele.termsConditions}
//                                     </p>

//                                     {role === "CUSTOMER" && <NavLink
//                                         to={`/purchasepolicy/${ele.planId}`}
//                                         className="addBtn"
//                                     >
//                                         🛒 Purchase Policy
//                                     </NavLink>}

//                                 </div>

//                             ))

//                             :

//                             <h2>
//                                 No Policy Plan Found
//                             </h2>
//                     }

//                 </div>

//             </div>

//         </div>
//     )
// }

// export default ViewPolicyPlan

import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import usePolicyByProductId from "../hooks/usePolicyByProductId";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../services/userService";

const ViewPolicyPlan = () => {
  const { productId } = useParams();
  const { policyData, loading, error } = usePolicyByProductId(productId);

  const [cusData, setCusData] = useState(null);

  const getCusData = async () => {
    try {

      const data = await getCurrentUser();

      setCusData(data);

      console.log("Agent Data:", data);

    } catch (error) {

      console.error(error);

    }
  };

  useEffect(() => {
    getCusData();
  }, []);

  const role = useSelector((state) => state.auth.role);

  const data =
    role === "CUSTOMER"
      ? policyData.filter((p) => p.active)
      : policyData;

  if (loading) return <h2 className="text-center p-10">Loading...</h2>;
  if (error) return <h2 className="text-center p-10">Error</h2>;

  return (
    <div className="min-h-screen bg-[#eef2f7] p-10 text-gray-500">

      <h1 className="text-4xl font-bold text-center mb-10">
        Policy Plans
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {data.length > 0 ? (
          data.map((ele) => (
            <div
              key={ele.planId}
              className="bg-white/30 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow hover:-translate-y-2 transition"
            >
              <span className="px-4 py-2 bg-purple-100 rounded-full text-sm font-semibold">
                {ele.premiumType}
              </span>

              <h2 className="text-xl font-bold mt-3">{ele.planName}</h2>

              <p>Coverage: ₹{ele.coverageAmount}</p>
              <p>Premium: ₹{ele.premiumAmount}</p>
              <p>Duration: {ele.duration} Years</p>

              <p className="font-semibold mt-2">
                {ele.active ? "Active" : "Inactive"}
              </p>

              {role === "CUSTOMER" && cusData.active ? (
                <NavLink
                  to={`/purchasepolicy/${ele.planId}`}
                  className="block mt-4 text-center py-3 rounded-xl bg-linear-to-r from-blue-200 to-blue-300 font-semibold"
                >
                  🛒 Purchase
                </NavLink>
              ) : <button
                disabled
                className="block mt-4 w-42 text-center py-3 rounded-xl bg-linear-to-r from-blue-200 to-blue-300 font-semibold"
              >
                Customer Inactive
              </button>}
            </div>
          ))
        ) : (
          <h2 className="text-center col-span-full">
            No Policy Found
          </h2>
        )}
      </div>
    </div>
  );
};

export default ViewPolicyPlan;