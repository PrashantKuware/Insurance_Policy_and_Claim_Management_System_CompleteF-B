// // import { FaBell, FaUserCircle } from "react-icons/fa";

// // const CustomerNavbar = () => {
// //   return (
// //     <div
// //       className="
// //       h-20
// //       flex
// //       items-center
// //       justify-between
// //       px-8
// // w-[80vw]
// //       bg-white/40
// //       backdrop-blur-2xl

// //       border-b border-white/50
// //       "
// //     >
// //       <div>
// //         <h2 className="text-2xl font-bold text-slate-800">
// //           Welcome Back 👋
// //         </h2>

// //         <p className="text-sm text-slate-500">
// //           Manage your insurance portfolio
// //         </p>
// //       </div>

// //       <div className="flex items-center gap-5">

// //         <button
// //           className="
// //           w-11 h-11
// //           rounded-full
// //           bg-white/70
// //           flex items-center justify-center
// //           shadow-md
// //           "
// //         >
// //           <FaBell className="text-slate-700" />
// //         </button>

// //         <div
// //           className="
// //           flex items-center gap-3
// //           bg-white/70
// //           px-4 py-2
// //           rounded-2xl
// //           shadow-md
// //           "
// //         >
// //           <FaUserCircle
// //             size={30}
// //             className="text-blue-600"
// //           />

// //           <div>
// //             <p className="font-semibold text-slate-800">
// //               Customer
// //             </p>

// //             <p className="text-xs text-slate-500">
// //               Insurance User
// //             </p>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default CustomerNavbar;

// import { FaBell, FaUserCircle } from "react-icons/fa";

// const CustomerNavbar = () => {
//   return (
//     <header
//       className="
//       sticky top-0 z-30
//       flex items-center justify-between
//       h-20 px-6 md:px-8
//       bg-white/80 backdrop-blur-xl
//       border-b border-slate-200
//       "
//     >
//       <div>
//         <h2 className="text-2xl font-bold text-slate-800">
//           Welcome Back 👋
//         </h2>

//         <p className="text-sm text-slate-500">
//           Manage your insurance portfolio
//         </p>
//       </div>

//       <div className="flex items-center gap-4">

//         <button className="relative h-11 w-11 rounded-full bg-white shadow-md flex items-center justify-center">
//           <FaBell className="text-slate-700" />

//           <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
//         </button>

//         <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-md">
//           <FaUserCircle
//             size={34}
//             className="text-blue-600"
//           />

//           <div>
//             <p className="font-semibold text-slate-800">
//               Customer
//             </p>

//             <p className="text-xs text-slate-500">
//               Insurance User
//             </p>
//           </div>
//         </div>

//       </div>
//     </header>
//   );
// };

// export default CustomerNavbar;

import { FaBell, FaUserCircle } from "react-icons/fa";

const CustomerNavbar = () => {
  return (
    <header
      className="
      sticky top-0 z-30
      flex items-center justify-between
      h-20 px-6 md:px-8
      bg-white/85 dark:bg-[#070d19]/40 backdrop-blur-xl
      border-b border-slate-200 dark:border-slate-800/60
      transition-colors duration-300
      "
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-850 dark:text-white tracking-wide">
          Welcome Back 👋
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your insurance portfolio
        </p>
      </div>

      <div className="flex items-center gap-4">

        {/* Notification Bell with Red Dot Counter */}
        <button className="relative h-11 w-11 rounded-xl bg-slate-100 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-850 hover:bg-slate-200 dark:hover:text-white dark:hover:bg-slate-800 transition-all shadow-md group cursor-pointer">
          <FaBell className="text-lg group-hover:rotate-12 transition-transform" />

          {/* Glowing Red Dot */}
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]"></span>
        </button>

        {/* Profile Card Frame */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-sm">
          <FaUserCircle
            size={32}
            className="text-blue-600 dark:text-blue-400"
          />

          <div className="hidden sm:block">
            <p className="font-semibold text-xs text-slate-800 dark:text-white leading-tight">
              Customer
            </p>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Insurance User
            </p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default CustomerNavbar;