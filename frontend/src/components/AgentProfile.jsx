// import { ArrowLeft, User, Mail, Shield } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getCurrentUser } from "../services/userService";

// const AgentProfile = () => {
//     const [agent, setAgent] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchAgent = async () => {
//             try {
//                 const data = await getCurrentUser();
//                 setAgent(data);
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchAgent();
//     }, []);

//     return (
//         <div className="max-w-4xl mx-auto">

//             {/* Header */}
//             <div className="flex items-center justify-between mb-8">

//                 <div>
//                     <h1 className="text-4xl font-bold text-white">
//                         Agent Profile
//                     </h1>

//                     <p className="text-slate-400 mt-2">
//                         View your profile information
//                     </p>
//                 </div>
//             </div>

//             {/* Profile Card */}
//             <div
//                 className="
//                     rounded-3xl
//                     border
//                     border-white/10
//                     bg-white/5
//                     backdrop-blur-xl
//                     overflow-hidden
//                 "
//             >

//                 {/* Top Banner */}
//                 <div className="h-25 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />

//                 {/* Avatar */}
//                 <div className="px-8 pb-8">

//                     <div
//                         className="
//                             -mt-16
//                             w-32
//                             h-32
//                             rounded-full
//                             border-4
//                             border-slate-900
//                             bg-gradient-to-r
//                             from-cyan-500
//                             to-blue-600
//                             flex
//                             items-center
//                             justify-center
//                         "
//                     >
//                         <User
//                             size={50}
//                             className="text-white"
//                         />
//                     </div>

//                     <h2 className="text-3xl font-bold text-white mt-4">
//                         {agent?.fullName}
//                     </h2>

//                     <p className="text-cyan-400 font-medium">
//                         {agent?.role}
//                     </p>

//                     {/* Info Cards */}
//                     <div className="grid md:grid-cols-3 gap-6 mt-8">

//                         <div className="bg-white/5 rounded-2xl p-5 border border-white/10">

//                             <Mail
//                                 className="text-cyan-400 mb-3"
//                                 size={28}
//                             />

//                             <p className="text-slate-400 text-sm">
//                                 Email
//                             </p>

//                             <h3 className="text-white font-semibold mt-1 break-all">
//                                 {agent?.email}
//                             </h3>

//                         </div>

//                         <div className="bg-white/5 rounded-2xl p-5 border border-white/10">

//                             <Shield
//                                 className="text-yellow-400 mb-3"
//                                 size={28}
//                             />

//                             <p className="text-slate-400 text-sm">
//                                 Role
//                             </p>

//                             <h3 className="text-white font-semibold mt-1">
//                                 {agent?.role}
//                             </h3>

//                         </div>

//                         <div className="bg-white/5 rounded-2xl p-5 border border-white/10">

//                             <Shield
//                                 className="text-green-400 mb-3"
//                                 size={28}
//                             />

//                             <p className="text-slate-400 text-sm">
//                                 Status
//                             </p>

//                             <h3 className="font-semibold mt-1 text-green-400">
//                                 {agent?.active
//                                     ? "ACTIVE"
//                                     : "INACTIVE"}
//                             </h3>

//                         </div>

//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default AgentProfile;

import { ArrowLeft, User, Mail, Shield, CheckCircle, AlertTriangle, Phone, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/userService";

const AgentProfile = () => {
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                setLoading(true);
                const data = await getCurrentUser();
                setAgent(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgent();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6 text-slate-300">
            
            {/* --- ACTION HEADER ROW --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-wide">
                        Operative Profile
                    </h1>
                    <p className="text-slate-500 text-xs mt-1">
                        Manage and review your authorized system credentials
                    </p>
                </div>
                
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-[#111c30] hover:bg-[#1b2a47] border border-slate-800/80 px-4 py-2.5 rounded-xl transition-all shadow-md self-start sm:self-center"
                >
                    <ArrowLeft size={14} className="text-cyan-400" /> Back
                </button>
            </div>

            {/* --- PROFILE HUB CARD --- */}
            {loading ? (
                /* Sleek Skeleton Loading State */
                <div className="rounded-3xl border border-slate-900 bg-[#111c30]/40 animate-pulse h-96 w-full" />
            ) : (
                <div className="rounded-3xl border border-slate-800/80 bg-[#111c30] shadow-2xl overflow-hidden relative">
                    
                    {/* Top Aesthetic Vector Gradient Banner */}
                    <div className="h-32 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    </div>

                    {/* Content Profile Wrapper */}
                    <div className="px-6 md:px-8 pb-8 relative">
                        
                        {/* Interactive Avatar Base */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-6">
                            <div className="relative inline-block">
                                <div className="w-28 h-28 rounded-2xl border-4 border-[#111c30] bg-slate-950 flex items-center justify-center text-cyan-400 shadow-xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent" />
                                    <User size={44} className="relative z-10" />
                                </div>
                                <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#111c30] 
                                    ${agent?.active ? 'bg-emerald-400' : 'bg-rose-400'}`} 
                                />
                            </div>

                            <div className="text-left sm:text-right">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border bg-slate-950/40
                                    ${agent?.active 
                                        ? "text-emerald-400 border-emerald-500/20" 
                                        : "text-rose-400 border-rose-500/20"
                                    }`}
                                >
                                    {agent?.active ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                    {agent?.active ? "Active Duty" : "Inactive"}
                                </span>
                            </div>
                        </div>

                        {/* Operative Identity Brief */}
                        <div className="border-b border-slate-800/50 pb-5 mb-6">
                            <h2 className="text-2xl font-bold text-white tracking-wide">
                                {agent?.fullName}
                            </h2>
                            <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider mt-1 inline-flex items-center gap-1.5 bg-cyan-500/5 border border-cyan-500/10 px-2.5 py-1 rounded-md">
                                <Briefcase size={12} /> {agent?.role || "Core Agent"}
                            </p>
                        </div>

                        {/* --- GRID METRICS --- */}
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            
                            {/* Card: Email */}
                            <div className="bg-slate-950/40 rounded-2xl p-4 border border-slate-900 flex flex-col justify-between group hover:border-slate-800 transition-all">
                                <div>
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                                        <Mail size={16} />
                                    </div>
                                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                        Communication Endpoint
                                    </p>
                                </div>
                                <h3 className="text-slate-200 font-mono text-xs font-semibold mt-2 break-all selection:bg-cyan-500/30">
                                    {agent?.email}
                                </h3>
                            </div>

                            {/* Card: Role Security */}
                            <div className="bg-slate-950/40 rounded-2xl p-4 border border-slate-900 flex flex-col justify-between group hover:border-slate-800 transition-all">
                                <div>
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                                        <Shield size={16} />
                                    </div>
                                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                        Clearance Level
                                    </p>
                                </div>
                                <h3 className="text-slate-200 text-sm font-bold mt-2 uppercase tracking-wide">
                                    {agent?.role}
                                </h3>
                            </div>

                            {/* Card: Phone Line (Fallback handled smoothly) */}
                            <div className="bg-slate-950/40 rounded-2xl p-4 border border-slate-900 flex flex-col justify-between group hover:border-slate-800 transition-all sm:col-span-2 md:col-span-1">
                                <div>
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                                        <Phone size={16} />
                                    </div>
                                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                        Secure Phone Line
                                    </p>
                                </div>
                                <h3 className="text-slate-200 font-mono text-xs font-semibold mt-2">
                                    +91 {agent?.mobileNumber || "No Phone Encrypted"}
                                </h3>
                            </div>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentProfile;