// import { NavLink, useNavigate } from "react-router-dom";
// import {
//     LayoutDashboard,
//     ClipboardCheck,
//     History,
//     LogOut
// } from "lucide-react";

// const AgentSidebar = () => {
//     const navigate = useNavigate()

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("role");

//         navigate("/", { replace: true });
//     };

//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     return (
//         <aside
//             className=" h-screen
//                 w-72
//                 bg-slate-900/80
//                 backdrop-blur-xl
//                 border-r
//                 border-white/10
//                 text-white
//                 hidden
//                 lg:flex
//                 flex-col
//             "
//         >
//             <div className="p-6 border-b border-white/10">

//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
//                     Agent Panel
//                 </h1>

//                 <p className="text-slate-400 mt-2">
//                     Claim Review System
//                 </p>

//             </div>

//             <nav className="flex-1 p-4 space-y-3">

//                 <NavLink
//                     to="/agentdashboard"
//                     className={({ isActive }) =>
//                         `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
//                             ? "bg-white/10 border border-cyan-400/30 text-cyan-400"
//                             : "hover:bg-white/10"
//                         }`
//                     }
//                 >
//                     <LayoutDashboard size={20} />
//                     Dashboard
//                 </NavLink>

//                 <NavLink
//                     to="/viewallclaimagent"
//                     className={({ isActive }) =>
//                         `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
//                             ? "bg-white/10 border border-cyan-400/30 text-cyan-400"
//                             : "hover:bg-white/10"
//                         }`
//                     }
//                 >
//                     <History size={20} />
//                     History
//                 </NavLink>
//                 <NavLink
//                     to="/agentprofile"
//                     className={({ isActive }) =>
//                         `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
//                             ? "bg-white/10 border border-cyan-400/30 text-cyan-400"
//                             : "hover:bg-white/10"
//                         }`
//                     }
//                 >
//                     <ClipboardCheck size={20} />
//                     Profile
//                 </NavLink>
//             </nav>

//             <div className="p-4 border-t border-white/10">

//                 <button
//                     className="
//                         w-full
//                         flex
//                         items-center
//                         justify-center
//                         gap-2
//                         px-4
//                         py-3
//                         rounded-xl
//                         bg-red-500/20
//                         text-red-300
//                         hover:bg-red-500/30
//                         transition
//                     "
//                     onClick={handleLogout}
//                 >
//                     <LogOut size={18} />
//                     Logout
//                 </button>

//             </div>

//         </aside>
//     );
// };

// export default AgentSidebar;

import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardCheck,
    History,
    LogOut,
    ShieldAlert
} from "lucide-react";

const AgentSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/", { replace: true });
    };

    // NavLink active state style classes handler
    const linkActionStyles = ({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 border group
        ${isActive
            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
            : "border-transparent text-slate-400 hover:text-white hover:bg-slate-900"
        }`;

    return (
        <aside className="h-screen w-72 bg-slate-950/40 backdrop-blur-xl border-r border-slate-900 text-slate-200 hidden md:flex flex-col select-none">
            
            {/* BRAND HEADER LAYER */}
            <div className="p-6 border-b border-slate-900/60">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/50">
                        <ShieldAlert size={18} />
                    </div>
                    <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-wide">
                        Agent Panel
                    </h1>
                </div>
                <p className="text-slate-500 text-[11px] font-medium tracking-wider uppercase mt-2 pl-0.5">
                    Claim Review System
                </p>
            </div>

            {/* DYNAMIC NAVIGATION LINKS */}
            <nav className="flex-1 p-4 space-y-2">
                
                {/* Dashboard Nav */}
                <NavLink to="/agentdashboard" className={linkActionStyles}>
                    <LayoutDashboard size={18} className="group-hover:scale-105 transition-transform" />
                    <span>Dashboard Portal</span>
                </NavLink>

                {/* History Claims Nav */}
                <NavLink to="/viewallclaimagent" className={linkActionStyles}>
                    <History size={18} className="group-hover:scale-105 transition-transform" />
                    <span>Audit History</span>
                </NavLink>

                {/* Profile Settings Nav */}
                <NavLink to="/agentprofile" className={linkActionStyles}>
                    <ClipboardCheck size={18} className="group-hover:scale-105 transition-transform" />
                    <span>Operative Profile</span>
                </NavLink>

            </nav>

            {/* SECURE SESSION DESTRUCTION CONTROL */}
            <div className="p-4 border-t border-slate-900/60 bg-slate-950/20">
                <button
                    onClick={handleLogout}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/5 hover:bg-rose-600 border border-rose-500/10 hover:border-transparent text-rose-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-rose-950/10"
                >
                    <LogOut size={14} />
                    <span>Terminate Session</span>
                </button>
            </div>

        </aside>
    );
};

export default AgentSidebar;