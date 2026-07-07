import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/userService';
import { toast } from 'react-toastify';
import { 
  FaUserCircle, FaEnvelope, FaPhoneAlt, FaShieldAlt, 
  FaCalendarCheck, FaUserEdit, FaCheckCircle, FaExclamationCircle 
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const CustomerProfile = () => {
    const [cusData, setCusData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const getCusData = async () => {
        try {
            setLoading(true);
            const response = await getCurrentUser();
            setCusData(response);
            console.log(response);
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message || 
                "Failed to fetch profile telemetry metrics ❌"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCusData();
    }, []);

    // Helper to format timestamps gracefully
    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        return new Date(isoString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Shimmer/Skeleton Loading state structure 
    if (loading) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto p-2">
                <div className="bg-[#111c30] p-8 rounded-3xl border border-slate-800/80 space-y-6 animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-800 rounded-full"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-6 bg-slate-800 rounded w-1/4"></div>
                            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="h-12 bg-slate-800 rounded-xl"></div>
                        <div className="h-12 bg-slate-800 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-2 text-slate-300">
            
            {/* Top Identity Profile Header Showcase */}
            <div className="bg-[#111c30] border border-slate-800/90 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    
                    {/* User Identity Info Left Details */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left flex-1 w-full">
                        {/* User Profile Avatar Frame */}
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-blue-500/10">
                                <div className="w-full h-full bg-[#070d19] rounded-full flex items-center justify-center text-slate-400">
                                    <FaUserCircle size={80} className="text-blue-500/90" />
                                </div>
                            </div>
                            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#111c30]" />
                        </div>

                        {/* Meta Identifiers */}
                        <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <h1 className="text-2xl font-black text-white tracking-wide truncate">
                                    {cusData?.fullName || "Identity Verified User"}
                                </h1>
                                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-black tracking-widest uppercase shrink-0">
                                    {cusData?.role || "CUSTOMER"}
                                </span>
                            </div>
                            <p className="text-slate-400 text-xs font-mono truncate">
                                User Pipeline Access Key ID: #{cusData?.userId || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* INTERACTIVE UPDATE PROFILE BUTTON CONTAINER */}
                    <div className="w-full sm:w-auto shrink-0">
                        <NavLink
                            to={"/customer/edit-profile"}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-600 border border-blue-500/20 hover:border-transparent text-blue-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-950/20 group"
                        >
                            <FaUserEdit size={14} className="group-hover:rotate-12 transition-transform" />
                            <span>Update Profile</span>
                        </NavLink>
                    </div>

                </div>
            </div>

            {/* Account Parameters Verification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Contact Coordinates */}
                <div className="bg-[#111c30] border border-slate-800/60 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
                        Contact Matrix Details
                    </h3>
                    
                    {/* Email Verification Box */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#070d19]/60 border border-slate-800">
                        <div className="flex items-center gap-3 truncate">
                            <FaEnvelope className="text-slate-500 text-sm shrink-0" />
                            <div className="truncate">
                                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Email Address</span>
                                <span className="text-xs font-mono text-white tracking-wide">{cusData?.email}</span>
                            </div>
                        </div>
                        <div>
                            {cusData?.emailVerified ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                                    <FaCheckCircle /> Verified
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
                                    <FaExclamationCircle /> Pending
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Mobile Number Block */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#070d19]/60 border border-slate-800">
                        <div className="flex items-center gap-3">
                            <FaPhoneAlt className="text-slate-500 text-sm shrink-0" />
                            <div>
                                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Mobile Parameter</span>
                                <span className="text-xs font-mono text-white tracking-wide">{cusData?.mobileNumber || "Not Linked"}</span>
                            </div>
                        </div>
                        <div>
                            {cusData?.mobileVerified ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                                    <FaCheckCircle /> Verified
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
                                    <FaExclamationCircle /> Unverified
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Audit Registry Timeline */}
                <div className="bg-[#111c30] border border-slate-800/60 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
                        Security & System Timestamps
                    </h3>
                    
                    {/* Created Logs */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#070d19]/60 border border-slate-800">
                        <FaCalendarCheck className="text-slate-500 text-sm shrink-0" />
                        <div>
                            <span className="block text-[10px] text-slate-500 font-semibold uppercase">Account Creation Metric</span>
                            <span className="text-xs font-mono text-slate-300">{formatDate(cusData?.createdDate)}</span>
                        </div>
                    </div>

                    {/* Last Modified Logs */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#070d19]/60 border border-slate-800">
                        <FaShieldAlt className="text-slate-500 text-sm shrink-0" />
                        <div>
                            <span className="block text-[10px] text-slate-500 font-semibold uppercase">Latest Telemetry Update</span>
                            <span className="text-xs font-mono text-slate-300">{formatDate(cusData?.updatedDate)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CustomerProfile;