// // import CustomerSidebar from "../components/CustomerSidebar";
// // import CustomerNavbar from "../components/CustomerNavbar";

// // const CustomerLayout = ({ children }) => {
// //   return (
// //     <div className="relative min-h-screen overflow-hidden bg-[#eef4ff]">

// //       {/* Background */}
// //       <div className="absolute inset-0">

// //         <div className="orb orb1"></div>
// //         <div className="orb orb2"></div>
// //         <div className="orb orb3"></div>
// //         <div className="orb orb4"></div>

// //       </div>

// //       <div className="relative z-10 flex">

// //         <div className="w-72 fixed h-screen">
// //           <CustomerSidebar />
// //         </div>

// //         <div className="ml-72 flex-1">

// //           <CustomerNavbar />

// //           <main className="p-8">
// //             {children}
// //           </main>

// //         </div>

// //       </div>

// //       <style>{`
// //         @keyframes float {
// //           50% {
// //             transform: translateY(-30px);
// //           }
// //         }

// //         .orb {
// //           position: absolute;
// //           border-radius: 999px;
// //           filter: blur(30px);
// //           animation: float 8s ease-in-out infinite;
// //         }

// //         .orb1 {
// //           width: 300px;
// //           height: 300px;
// //           background: #93c5fd;
// //           top: -50px;
// //           left: 25%;
// //         }

// //         .orb2 {
// //           width: 220px;
// //           height: 220px;
// //           background: #c4b5fd;
// //           top: 20%;
// //           right: 10%;
// //         }

// //         .orb3 {
// //           width: 250px;
// //           height: 250px;
// //           background: #bfdbfe;
// //           bottom: 10%;
// //           left: 10%;
// //         }

// //         .orb4 {
// //           width: 180px;
// //           height: 180px;
// //           background: #ddd6fe;
// //           bottom: 5%;
// //           right: 15%;
// //         }
// //       `}</style>

// //     </div>
// //   );
// // };

// // export default CustomerLayout;

// import CustomerSidebar from "./CustomerSidebar";
// import CustomerNavbar from "./CustomerNavbar";

// const CustomerLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-slate-100">

//       {/* Background */}
//       <div className="fixed inset-0 overflow-hidden -z-10">

//         <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-blue-300 blur-3xl opacity-30 animate-pulse"></div>

//         <div className="absolute top-40 right-20 h-72 w-72 rounded-full bg-indigo-300 blur-3xl opacity-30 animate-pulse"></div>

//         <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-cyan-300 blur-3xl opacity-30 animate-pulse"></div>

//       </div>

//       <div className="flex">

//         <CustomerSidebar />

//         <div className="flex-1 lg:ml-72">

//           <CustomerNavbar />

//           <main className="p-4 md:p-8">
//             {children}
//           </main>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default CustomerLayout;

import React from "react";
import CustomerSidebar from "./CustomerSidebar";
import CustomerNavbar from "./CustomerNavbar";

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#070d19] text-white relative overflow-x-hidden">

      {/* --- PREMIUM DEEP AMBIENT DARK GLOW BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Neon Royal Blue Orb */}
        <div className="absolute top-[-10%] left-[20%] h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[120px] animate-pulse" 
             style={{ animationDuration: '8s' }}></div>

        {/* Deep Indigo/Purple Orb */}
        <div className="absolute top-[30%] right-[-5%] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse"
             style={{ animationDuration: '12s' }}></div>

        {/* Cyber Cyan Bottom Orb */}
        <div className="absolute bottom-[-10%] left-[-5%] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[90px] animate-pulse"
             style={{ animationDuration: '10s' }}></div>
             
      </div>

      {/* --- DASHBOARD LAYER FRAMEWORK --- */}
      <div className="flex relative z-10">

        {/* Navigation Control Center: Sidebar */}
        <CustomerSidebar />

        {/* Dynamic Content Stream Area */}
        <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">

          {/* Context Application Navbar */}
          <CustomerNavbar />

          {/* Injected Active Customer Dashboard / Policy Components */}
          <main className="p-4 md:p-8 flex-1">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
};

export default CustomerLayout;