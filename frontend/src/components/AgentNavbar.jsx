// import { useState } from "react";
// import { Bell, UserCircle2, X } from "lucide-react";
// import axios from "axios";
// import { getCurrentUser } from "../services/userService";

// const AgentNavbar = () => {
//     const [showProfile, setShowProfile] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [agentData, setAgentData] = useState(null);

//     const getAgentData = async () => {
//         try {
//             setLoading(true);
//             const response = await getCurrentUser()

//             setAgentData(response);
//             setShowProfile(true);
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <header
//                 className="
//                     h-20
//                     border-b
//                     border-white/10
//                     bg-slate-900/70
//                     backdrop-blur-xl
//                     flex
//                     items-center
//                     justify-between
//                     px-8
//                 "
//             >
//                 <div>
//                     <h2 className="text-2xl font-bold text-white">
//                         Agent Dashboard
//                     </h2>

//                     <p className="text-slate-400 text-sm">
//                         Review & Manage Insurance Claims
//                     </p>
//                 </div>

//                 <div className="flex items-center gap-5">

//                     <button
//                         onClick={getAgentData}
//                         className="
//                             flex
//                             items-center
//                             gap-3
//                             px-4
//                             py-2
//                             rounded-xl
//                             bg-white/10
//                             hover:bg-white/20
//                             transition
//                         "
//                     >
//                         <UserCircle2 size={28} />
//                         <span className="text-white font-medium">
//                             {loading ? "Loading..." : "Agent"}
//                         </span>
//                     </button>
//                 </div>
//             </header>

//             {showProfile && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//                     <div
//                         className="
//                             w-full
//                             max-w-md
//                             rounded-3xl
//                             border
//                             border-white/10
//                             bg-slate-900
//                             p-8
//                             shadow-2xl
//                         "
//                     >
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-2xl font-bold text-white">
//                                 Agent Profile
//                             </h2>

//                             <button
//                                 onClick={() => setShowProfile(false)}
//                                 className="text-white"
//                             >
//                                 <X />
//                             </button>
//                         </div>

//                         <div className="flex justify-center mb-6">
//                             <UserCircle2
//                                 size={90}
//                                 className="text-cyan-400"
//                             />
//                         </div>

//                         <div className="space-y-4 text-white">
//                             <div>
//                                 <p className="text-slate-400 text-sm">
//                                     Full Name
//                                 </p>
//                                 <p className="font-semibold">
//                                     {agentData?.fullName}
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className="text-slate-400 text-sm">
//                                     Email
//                                 </p>
//                                 <p className="font-semibold">
//                                     {agentData?.email}
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className="text-slate-400 text-sm">
//                                     Role
//                                 </p>
//                                 <p className="font-semibold">
//                                     {agentData?.role}
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className="text-slate-400 text-sm">
//                                     Status
//                                 </p>

//                                 <span
//                                     className={`px-3 py-1 rounded-full text-sm font-semibold ${agentData?.active
//                                             ? "bg-green-500/20 text-green-400"
//                                             : "bg-red-500/20 text-red-400"
//                                         }`}
//                                 >
//                                     {agentData?.active
//                                         ? "ACTIVE"
//                                         : "INACTIVE"}
//                                 </span>
//                             </div>

//                             {agentData?.phoneNumber && (
//                                 <div>
//                                     <p className="text-slate-400 text-sm">
//                                         Phone Number
//                                     </p>
//                                     <p className="font-semibold">
//                                         {agentData.phoneNumber}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default AgentNavbar;

import { useState } from "react";
import { Bell, UserCircle2, X, Shield, Mail, Briefcase, Phone, CheckCircle, AlertTriangle } from "lucide-react";
import { getCurrentUser } from "../services/userService";

const AgentNavbar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agentData, setAgentData] = useState(null);

    const getAgentData = async () => {
        try {
            setLoading(true);
            const response = await getCurrentUser();
            setAgentData(response);
            setShowProfile(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* NAVBAR HEADER */}
            <header className="h-20 border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/40 backdrop-blur-xl flex items-center justify-between px-6 md:px-8 z-40 relative transition-colors duration-300">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-wide">
                        Agent Dashboard
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs hidden sm:block mt-0.5">
                        Review & Manage Insurance Claims Pipeline
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* NOTIFICATION HUB ICON */}
                    <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 hover:bg-slate-200 dark:hover:text-white dark:hover:bg-slate-800/60 transition-all relative cursor-pointer">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                    </button>

                    {/* USER PROFILE TRIGGER */}
                    <button
                        onClick={getAgentData}
                        disabled={loading}
                        className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <UserCircle2 size={20} className="text-cyan-600 dark:text-cyan-400" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {loading ? "Syncing..." : "Profile"}
                        </span>
                    </button>
                </div>
            </header>

            {/* PROFILE MODAL EXTENSION */}
            {showProfile && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="w-full max-w-md rounded-[28px] border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-[#111c30] p-6 shadow-2xl relative overflow-hidden text-slate-800 dark:text-white">
                        
                        {/* Top Decorative Vector Accent */}
                        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-cyan-500 to-blue-500" />

                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">
                                    Identity Verification
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Authorized operative session data</p>
                            </div>
                            <button
                                onClick={() => setShowProfile(false)}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-rose-600/10 hover:border-rose-500/20 transition-all cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Big Avatar Badge */}
                        <div className="flex flex-col items-center justify-center py-4 mb-6 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900/60">
                            <div className="p-2 rounded-full bg-cyan-500/5 border border-cyan-500/10 mb-2">
                                <UserCircle2 size={68} className="text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">{agentData?.fullName}</h3>
                            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-550 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-widest font-black">
                                {agentData?.role || "Agent"}
                            </span>
                        </div>

                        {/* Profile Matrix Fields */}
                        <div className="space-y-3 text-xs">
                            
                            {/* Email Item */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-900/50">
                                <span className="text-slate-500 dark:text-slate-400 font-medium inline-flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400 dark:text-slate-655" /> Email Address
                                </span>
                                <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{agentData?.email}</span>
                            </div>

                            {/* Status Checked Item */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-900/50">
                                <span className="text-slate-500 dark:text-slate-400 font-medium inline-flex items-center gap-2">
                                    <Shield size={14} className="text-slate-400 dark:text-slate-655" /> Security State
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase border
                                    ${agentData?.active 
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                                        : "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20"
                                    }`}
                                >
                                    {agentData?.active ? (
                                        <><CheckCircle size={10} /> Operational</>
                                    ) : (
                                        <><AlertTriangle size={10} /> Suspended</>
                                    )}
                                </span>
                            </div>

                            {/* Optional Phone Field */}
                            {agentData?.phoneNumber && (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-900/50">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium inline-flex items-center gap-2">
                                        <Phone size={14} className="text-slate-400 dark:text-slate-655" /> Communication Line
                                    </span>
                                    <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{agentData.phoneNumber}</span>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AgentNavbar;