// // import { NavLink } from "react-router-dom";
// // import {
// //   FaHome,
// //   FaShieldAlt,
// //   FaBoxOpen,
// //   FaFileSignature,
// // } from "react-icons/fa";

// // const CustomerSidebar = () => {
// //   const links = [
// //     {
// //       name: "Dashboard",
// //       path: "/customerdashboard",
// //       icon: <FaHome />,
// //     },
// //     {
// //       name: "My Policies",
// //       path: "/customer/policies",
// //       icon: <FaShieldAlt />,
// //     },
// //     {
// //       name: "Products",
// //       path: "/customer/products",
// //       icon: <FaBoxOpen />,
// //     },
// //     {
// //       name: "Claims",
// //       path: "/customer/claims",
// //       icon: <FaFileSignature />,
// //     },
// //   ];

// //   return (
// //     <div className="h-full bg-[#0f172a]/90 backdrop-blur-2xl text-white p-6">

// //       <h1 className="text-3xl font-bold mb-10">
// //         🛡 Customer
// //       </h1>

// //       <div className="space-y-3">

// //         {links.map((item) => (
// //           <NavLink
// //             key={item.path}
// //             to={item.path}
// //             className={({ isActive }) =>
// //               `
// //               flex items-center gap-4
// //               px-5 py-4 rounded-2xl
// //               transition-all duration-300

// //               ${
// //                 isActive
// //                   ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
// //                   : "hover:bg-white/10"
// //               }
// //             `
// //             }
// //           >
// //             <span className="text-lg">{item.icon}</span>
// //             <span>{item.name}</span>
// //           </NavLink>
// //         ))}

// //       </div>
// //     </div>
// //   );
// // };

// // export default CustomerSidebar;

// import { NavLink } from "react-router-dom";
// import {
//   FaHome,
//   FaShieldAlt,
//   FaFileSignature,
//   FaUserCircle,
// } from "react-icons/fa";

// const CustomerSidebar = () => {
//   const links = [
//     {
//       name: "Dashboard",
//       path: "/customerdashboard",
//       icon: <FaHome />,
//     },
//     {
//       name: "My Policies",
//       path: "/customer/policies",
//       icon: <FaShieldAlt />,
//     },
//     {
//       name: "Claims",
//       path: "/customer/claims",
//       icon: <FaFileSignature />,
//     },
//     {
//       name: "Profile",
//       path: "/customer/profile",
//       icon: <FaUserCircle />,
//     },
//   ];

//   return (
//     <aside
//       className="
//       fixed
//       left-0
//       top-0
//       w-72
//       h-screen
//       bg-slate-950
//       border-r
//       border-slate-800
//       shadow-2xl
//       flex
//       flex-col
//       "
//     >
//       {/* Logo */}
//       <div className="p-8 border-b border-slate-800">
//         <h1
//           className="
//           text-3xl
//           font-extrabold
//           bg-gradient-to-r
//           from-blue-400
//           to-indigo-500
//           bg-clip-text
//           text-transparent
//           "
//         >
//           INSURE+
//         </h1>

//         <p className="text-slate-400 text-sm mt-2">
//           Customer Portal
//         </p>
//       </div>

//       {/* Menu */}
//       <nav className="flex-1 p-5 space-y-3">
//         {links.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             className={({ isActive }) =>
//               `
//               flex
//               items-center
//               gap-4
//               px-5
//               py-4
//               rounded-2xl
//               font-medium
//               transition-all
//               duration-300
//               ${
//                 isActive
//                   ? `
//                   bg-gradient-to-r
//                   from-blue-600
//                   to-indigo-600
//                   text-white
//                   shadow-lg
//                   `
//                   : `
//                   text-slate-300
//                   hover:bg-slate-800
//                   hover:text-white
//                   `
//               }
//             `
//             }
//           >
//             <span className="text-lg">{item.icon}</span>
//             <span>{item.name}</span>
//           </NavLink>
//         ))}
//       </nav>

//       {/* User */}
//       <div className="p-5 border-t border-slate-800">
//         <div className="flex items-center gap-3">
//           <div
//             className="
//             w-12
//             h-12
//             rounded-full
//             bg-gradient-to-r
//             from-blue-500
//             to-indigo-600
//             flex
//             items-center
//             justify-center
//             text-white
//             font-bold
//             "
//           >
//             C
//           </div>

//           <div>
//             <h3 className="text-white font-semibold">
//               Customer
//             </h3>

//             <p className="text-slate-400 text-xs">
//               Insurance User
//             </p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default CustomerSidebar;

import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShieldAlt,
  FaFileSignature,
  FaUserCircle,
  FaSignOutAlt,
  FaBoxOpen,
} from "react-icons/fa";
import { toast } from "react-toastify";

const CustomerSidebar = () => {
  const navigate = useNavigate();

  const links = [
    {
      name: "Dashboard",
      path: "/customerdashboard",
      icon: <FaHome />,
    },
    {
      name: "My Policies",
      path: "/customer/policies",
      icon: <FaShieldAlt />,
    },
    {
      name: "All Product",
      path: "/customer/product",
      icon: <FaBoxOpen />,
    },
    {
      name: "Profile",
      path: "/customer/profile",
      icon: <FaUserCircle />,
    },
  ];

  // Logout Trigger Function Handler
  const handleLogout = () => {
    // Agar local storage me tokens hain toh unhe yahan clear karein
    localStorage.clear();
    sessionStorage.clear();

    toast.success("Logged out successfully! 👋");
    navigate("/"); // Aapka auth routes login page path
  };

  return (
    <aside
      className="
      fixed
      left-0
      top-0
      w-72
      h-screen
      bg-[#0b1426]
      border-r
      border-slate-800/80
      shadow-[5px_0_30px_rgba(0,0,0,0.3)]
      flex
      flex-col
      z-40
      hidden lg:flex
      "
    >
      {/* Brand Header Identity Logo */}
      <div className="p-8 border-b border-slate-800/60 bg-slate-900/20">
        <h1
          className="
          text-3xl
          font-black
          tracking-wider
          bg-gradient-to-r
          from-blue-400
          via-blue-500
          to-indigo-500
          bg-clip-text
          text-transparent
          "
        >
          INSUREX
        </h1>

        <p className="text-slate-500 text-xs mt-1.5 font-semibold tracking-wide uppercase">
          Customer Portal
        </p>
      </div>

      {/* Navigation Router Directory Links Menu */}
      <nav className="flex-1 p-5 space-y-2.5 mt-4">
        {links.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `
              flex
              items-center
              gap-4
              px-5
              py-3.5
              rounded-xl
              font-semibold
              text-xs
              tracking-wide
              transition-all
              duration-300
              ${isActive
                ? `
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  text-white
                  shadow-md
                  shadow-blue-500/20
                  `
                : `
                  text-slate-400
                  hover:bg-slate-800/50
                  hover:text-white
                  `
              }
            `
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* --- BOTTOM LOGOUT SYSTEM TRIGGER SECTION --- */}
      <div className="p-5 border-t border-slate-800/60 bg-slate-900/20">
        <button
          onClick={handleLogout}
          className="
          w-full
          flex
          items-center
          gap-4
          px-5
          py-3.5
          rounded-xl
          font-semibold
          text-xs
          tracking-wide
          text-rose-400
          bg-rose-500/5
          border
          border-rose-500/10
          hover:bg-rose-600
          hover:text-white
          hover:border-transparent
          transition-all
          duration-300
          group
          "
        >
          <FaSignOutAlt className="text-base group-hover:-translate-x-0.5 transition-transform" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};

export default CustomerSidebar;