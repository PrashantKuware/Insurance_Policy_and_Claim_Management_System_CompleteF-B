// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { motion } from "framer-motion";
// import "./Product.css";
// import useProducts from '../hooks/useGetAllProduct';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';

// const Product = () => {

//     const {
//     productData,
//     loading,
//     error,
//     refreshProducts
// } = useProducts();

//     const role = useSelector(
//         (state) => state.auth.role
//     );

//     const filteredProducts =
//         role === "CUSTOMER"
//             ? productData.filter((ele) => ele.active === true)
//             : productData;

//     if (loading) {
//         return (
//             <div className="container">

//                 <div className="orb orb1"></div>
//                 <div className="orb orb2"></div>
//                 <div className="orb orb3"></div>
//                 <div className="orb orb4"></div>

//                 <div className="productWrapper">

//                     <div className="pageHeader">
//                         <div className="h-10 w-64 bg-gray-300 rounded animate-pulse"></div>
//                     </div>

//                     <div className="productGrid">

//                         {Array.from({ length: 6 }).map((_, index) => (

//                             <div
//                                 key={index}
//                                 className="productCard animate-pulse"
//                             >

//                                 <div className="h-6 w-24 bg-gray-300 rounded mb-4"></div>

//                                 <div className="h-8 w-40 bg-gray-300 rounded mb-4"></div>

//                                 <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>

//                                 <div className="h-4 w-4/5 bg-gray-300 rounded mb-4"></div>

//                                 <div className="h-5 w-28 bg-gray-300 rounded mb-5"></div>

//                                 <div className="flex gap-3">

//                                     <div className="h-10 w-28 bg-gray-300 rounded"></div>

//                                     <div className="h-10 w-28 bg-gray-300 rounded"></div>

//                                 </div>

//                             </div>

//                         ))}

//                     </div>

//                 </div>

//             </div>
//         );
//     }

//     if (error) {

//         toast.error(
//             error?.message ||
//             "Failed To Load Products ❌"
//         );

//         return (
//             <div className="container">

//                 <div className="flex justify-center items-center min-h-[60vh]">

//                     <h2 className="text-2xl font-bold text-red-500">
//                         Failed To Load Products
//                     </h2>

//                 </div>

//             </div>
//         );
//     }

//     return (
//         <div className="container">

//             <div className="orb orb1"></div>
//             <div className="orb orb2"></div>
//             <div className="orb orb3"></div>
//             <div className="orb orb4"></div>

//             <div className="productWrapper">

//                 <div className="pageHeader">

//                     <h1>
//                         Insurance Products
//                     </h1>

//                     {
//                         role === "ADMIN" && (

//                             <NavLink
//                                 to="/addProduct"
//                                 className="addBtn"
//                             >
//                                 + Add Product
//                             </NavLink>

//                         )
//                     }

//                 </div>

//                 <div className="productGrid">

//                     {
//                         filteredProducts.length > 0 ? (

//                             filteredProducts.map((ele) => (

//                                 <motion.div
//                                     key={ele.productId}
//                                     className="productCard"
//                                     whileHover={{
//                                         y: -10,
//                                         scale: 1.03
//                                     }}
//                                 >

//                                     <div className="badge">
//                                         {ele.productType}
//                                     </div>

//                                     <h2>
//                                         {ele.productName}
//                                     </h2>

//                                     <p>
//                                         {ele.description}
//                                     </p>

//                                     <div className="status">

//                                         Status :

//                                         <span
//                                             className={
//                                                 ele.active
//                                                     ? "text-green-500 font-semibold"
//                                                     : "text-red-500 font-semibold"
//                                             }
//                                         >
//                                             {
//                                                 ele.active
//                                                     ? " Active"
//                                                     : " Inactive"
//                                             }
//                                         </span>

//                                     </div>

//                                     <div className="cardButtons">

//                                         <NavLink
//                                             to={`/viewallplan/${ele.productId}`}
//                                             className="viewBtn"
//                                         >
//                                             View Plans
//                                         </NavLink>

//                                         {
//                                             role === "ADMIN" && (

//                                                 <NavLink
//                                                     to={`/addplan/${ele.productId}`}
//                                                     className="planBtn"
//                                                 >
//                                                     Add Plan
//                                                 </NavLink>

//                                             )
//                                         }

//                                     </div>

//                                 </motion.div>

//                             ))

//                         ) : (

//                             <div className="col-span-full text-center py-12">

//                                 <h2 className="text-2xl font-semibold text-gray-600">
//                                     No Products Found
//                                 </h2>

//                             </div>

//                         )
//                     }

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default Product;

import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import useProducts from "../hooks/useGetAllProduct";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Orbs = () => (
  <>
    <div className="absolute w-[320px] h-[320px] rounded-full bg-gradient-radial from-white to-blue-200 top-[-60px] left-[30%] animate-float" />
    <div className="absolute w-[150px] h-[150px] rounded-full bg-gradient-radial from-white to-blue-200 top-[15%] right-[20%] animate-float delay-2000" />
    <div className="absolute w-[220px] h-[220px] rounded-full bg-gradient-radial from-white to-blue-200 bottom-[15%] left-[10%] animate-float delay-1000" />
    <div className="absolute w-[180px] h-[180px] rounded-full bg-gradient-radial from-white to-blue-200 bottom-[10%] right-[10%] animate-float delay-3000" />
  </>
);

const Product = () => {
  const { productData, loading, error } = useProducts();
  const role = useSelector((state) => state.auth.role);

  const filteredProducts =
    role === "CUSTOMER"
      ? productData.filter((p) => p.active === true)
      : productData;

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#eef2f7] overflow-hidden">

        <Orbs />

        <div className="w-[90%] max-w-[1400px] z-10">

          <div className="flex justify-between items-center mb-8">
            <div className="h-10 w-64 bg-gray-300 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/30 border border-white/30 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 w-24 bg-gray-300 rounded mb-4" />
                <div className="h-8 w-40 bg-gray-300 rounded mb-4" />
                <div className="h-4 w-full bg-gray-300 rounded mb-2" />
                <div className="h-4 w-4/5 bg-gray-300 rounded mb-4" />
                <div className="h-5 w-28 bg-gray-300 rounded mb-5" />

                <div className="flex gap-3">
                  <div className="h-10 w-full bg-gray-300 rounded" />
                  <div className="h-10 w-full bg-gray-300 rounded" />
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(error?.message || "Failed To Load Products ❌");

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef2f7]">
        <h2 className="text-2xl font-bold text-red-500">
          Failed To Load Products
        </h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#eef2f7] p-10 overflow-hidden">

      <Orbs />

      <div className="relative z-10 w-[90%] max-w-[1400px] mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800">
            Insurance Products
          </h1>

          {role === "ADMIN" && (
            <NavLink
              to="/addProduct"
              className="px-6 py-3 rounded-xl font-semibold text-slate-800
              bg-gradient-to-r from-blue-200 to-blue-300
              hover:-translate-y-1 transition"
            >
              + Add Product
            </NavLink>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredProducts.length > 0 ? (
            filteredProducts.map((ele) => (
              <motion.div
                key={ele.productId}
                className="backdrop-blur-xl bg-white/30 border border-white/30
                rounded-3xl p-6 shadow-lg hover:shadow-xl transition"
                whileHover={{ y: -10, scale: 1.03 }}
              >

                <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-sm font-semibold mb-4">
                  {ele.productType}
                </span>

                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {ele.productName}
                </h2>

                <p className="text-gray-600 min-h-[70px] leading-relaxed mb-4">
                  {ele.description}
                </p>

                <div className="mb-4 font-semibold text-slate-700">
                  Status:{" "}
                  <span
                    className={
                      ele.active ? "text-green-600" : "text-red-500"
                    }
                  >
                    {ele.active ? " Active" : " Inactive"}
                  </span>
                </div>

                <div className="flex gap-3">

                  <NavLink
                    to={`/viewallplan/${ele.productId}`}
                    className="flex-1 text-center py-3 rounded-xl font-semibold
                    bg-blue-100 text-slate-800 hover:-translate-y-1 transition"
                  >
                    View Plans
                  </NavLink>

                  {role === "ADMIN" && (
                    <NavLink
                      to={`/addplan/${ele.productId}`}
                      className="flex-1 text-center py-3 rounded-xl font-semibold
                      bg-slate-800 text-white hover:-translate-y-1 transition"
                    >
                      Add Plan
                    </NavLink>
                  )}

                </div>

              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-600">
                No Products Found
              </h2>
            </div>
          )}

        </div>
      </div>

      {/* animations */}
      <style>{`
        @keyframes float {
          50% { transform: translateY(-30px) rotate(10deg); }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
        .delay-3000 { animation-delay: 3s; }
      `}</style>

    </div>
  );
};

export default Product;