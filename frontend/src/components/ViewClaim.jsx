// import React, { useEffect, useState } from 'react';
// import { NavLink, useParams } from 'react-router-dom';
// import { getPolicyByPolicyId } from '../services/policyService';
// import {
//     getClaimByPolicyId,
//     getClaimDocument,
//     withdrawClaimById
// } from '../services/claimService';
// import { toast } from 'react-toastify';
// import { downloadClaimHistoryPdf } from '../services/claimHistoryService';

// const ViewClaim = () => {

//     const { policyId } = useParams();

//     const [planData, setPlanData] = useState({});
//     const [claimData, setClaimData] = useState(null);
//     const [claimDocuData, setClaimDocuData] = useState([]);

//     const [claimId, setClaimId] = useState(null);

//     const [loading, setLoading] = useState(true);
//     const [withdrawLoading, setWithdrawLoading] = useState(false);

//     const getPolicyById = async () => {

//         try {

//             const data = await getPolicyByPolicyId(policyId);

//             setPlanData(data);

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Failed To Load Policy ❌"
//             );
//         }
//     };

//     const getClaimData = async () => {

//         try {

//             const data = await getClaimByPolicyId(policyId);

//             const claims = data?.content || [];

//             if (claims.length > 0) {

//                 const latestClaim = claims[claims.length - 1];

//                 setClaimData(latestClaim);
//                 setClaimId(latestClaim.claimId);

//             }


//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Failed To Load Claim ❌"
//             );
//         }
//     };

//     const getDocuData = async (id) => {

//         try {

//             const data = await getClaimDocument(id);

//             setClaimDocuData(data || []);

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Failed To Load Documents ❌"
//             );
//         }
//     };

//     const withdrawClaim = async () => {

//         try {

//             setWithdrawLoading(true);

//             const data = await withdrawClaimById(claimId);

//             setClaimData(data);

//             toast.success(
//                 "Claim Withdrawn Successfully ✅"
//             );

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Failed To Withdraw Claim ❌"
//             );

//         } finally {

//             setWithdrawLoading(false);

//         }
//     };

//     useEffect(() => {

//         const loadData = async () => {

//             setLoading(true);

//             await Promise.all([
//                 getPolicyById(),
//                 getClaimData()
//             ]);

//             setLoading(false);
//         };

//         loadData();

//     }, [policyId]);

//     useEffect(() => {

//         if (claimId) {
//             getDocuData(claimId);
//         }

//     }, [claimId]);

//     if (loading) {

//         return (
//             <div className="p-6 space-y-4">

//                 <div className="bg-white p-6 rounded-xl shadow animate-pulse">

//                     <div className="h-6 bg-gray-300 rounded w-52 mb-4"></div>

//                     <div className="space-y-3">

//                         <div className="h-4 bg-gray-300 rounded"></div>
//                         <div className="h-4 bg-gray-300 rounded"></div>
//                         <div className="h-4 bg-gray-300 rounded"></div>
//                         <div className="h-4 bg-gray-300 rounded"></div>

//                     </div>

//                 </div>

//             </div>
//         );
//     }

//     const oneYearCompleted =
//         planData?.startDate &&
//         new Date(
//             new Date(planData.startDate).setFullYear(
//                 new Date(planData.startDate).getFullYear() + 1
//             )
//         ) <= new Date();

//     return (
//         <div className="p-6 space-y-6 text-gray-500">

//             {/* Policy Details */}
//             <div className="bg-white rounded-xl shadow-lg p-6">

//                 <div className="flex items-center justify-between mb-6">

//                     <h2 className="text-2xl font-bold">
//                         Policy Details
//                     </h2>

//                     {
//                         planData.policyStatus === "ACTIVE" &&
//                         (
//                             !claimData ||
//                             claimData.claimStatus === "APPROVED" ||
//                             claimData.claimStatus === "REJECTED" ||
//                             claimData.claimStatus === "WITHDRAWN"
//                         ) && (

//                             <NavLink
//                                 to={`/policy/submitclaim/${planData.policyId}`}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
//                             >
//                                 Submit New Claim
//                             </NavLink>

//                         )
//                     }

//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">

//                     <p>
//                         <strong>Customer:</strong>{" "}
//                         {planData.customerName}
//                     </p>

//                     <p>
//                         <strong>Plan:</strong>{" "}
//                         {planData.planName}
//                     </p>

//                     <p>
//                         <strong>Policy ID:</strong>{" "}
//                         {planData.policyId}
//                     </p>

//                     <p>
//                         <strong>Policy Number:</strong>{" "}
//                         {planData.policyNumber}
//                     </p>

//                     <p>
//                         <strong>Status:</strong>{" "}
//                         <span
//                             className={`font-semibold ${planData.policyStatus === "ACTIVE"
//                                 ? "text-green-600"
//                                 : "text-red-600"
//                                 }`}
//                         >
//                             {planData.policyStatus}
//                         </span>
//                     </p>

//                     <p>
//                         <strong>Total Premium Paid:</strong>{" "}
//                         ₹{planData.totalPremiumPaid}
//                     </p>

//                     <p>
//                         <strong>Start Date:</strong>{" "}
//                         {planData.startDate}
//                     </p>

//                     <p>
//                         <strong>End Date:</strong>{" "}
//                         {planData.endDate}
//                     </p>

//                     <NavLink
//                         to={`/claim-history/policy/${planData.policyId}`}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
//                     >
//                         View Full Claim History
//                     </NavLink>

//                     <button
//                         onClick={() =>
//                             downloadClaimHistoryPdf(
//                                 planData.policyId
//                             )
//                         }
//                         className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
//                     >
//                         Download PDF
//                     </button>
//                 </div>

//             </div>


//             {/* Claim Details */}

//             {
//                 claimData ? (

//                     <div className="bg-green-50 border border-green-300 rounded-xl p-6 shadow">

//                         <h2 className="text-2xl font-bold mb-4">
//                             Claim Details
//                         </h2>

//                         <div className="grid md:grid-cols-2 gap-4">

//                             <p>
//                                 <strong>Claim ID:</strong>{" "}
//                                 {claimData.claimId}
//                             </p>

//                             <p>
//                                 <strong>Claim Number:</strong>{" "}
//                                 {claimData.claimNumber}
//                             </p>

//                             <p>
//                                 <strong>Claim Amount:</strong>{" "}
//                                 ₹{claimData.claimAmount}
//                             </p>

//                             <p>
//                                 <strong>Status:</strong>{" "}
//                                 {claimData.claimStatus}
//                             </p>

//                             <p className="md:col-span-2">
//                                 <strong>Reason:</strong>{" "}
//                                 {claimData.claimReason}
//                             </p>

//                             <NavLink
//                                 to={`/claim-history/claim/${claimData.claimId}`}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
//                             >
//                                 View Claim History
//                             </NavLink>

//                         </div>

//                         {
//                             claimData.claimStatus === "SUBMITTED" && (

//                                 <button
//                                     onClick={withdrawClaim}
//                                     disabled={withdrawLoading}
//                                     className="mt-5 bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
//                                 >

//                                     {
//                                         withdrawLoading
//                                             ? "Processing..."
//                                             : "Withdraw Claim"
//                                     }

//                                 </button>

//                             )
//                         }

//                     </div>

//                 ) : (

//                     <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6">

//                         <h2 className="text-xl font-semibold">
//                             Claim Not Submitted Yet
//                         </h2>

//                     </div>

//                 )
//             }

//             {/* Documents */}

//             {
//                 claimDocuData.length > 0 && (

//                     <div>

//                         <h2 className="text-2xl font-bold mb-4">
//                             Uploaded Documents
//                         </h2>

//                         <div className="grid md:grid-cols-2 gap-4">

//                             {
//                                 claimDocuData.map((doc) => (

//                                     <div
//                                         key={doc.documentId}
//                                         className="bg-white border rounded-xl p-4 shadow"
//                                     >

//                                         <p>
//                                             <strong>File:</strong>{" "}
//                                             {doc.originalFileName}
//                                         </p>

//                                         <p>
//                                             <strong>Type:</strong>{" "}
//                                             {doc.contentType}
//                                         </p>

//                                         <p>
//                                             <strong>Size:</strong>{" "}
//                                             {doc.sizeInBytes} bytes
//                                         </p>

//                                         {
//                                             doc.resourceType === "image" && (

//                                                 <img
//                                                     src={doc.cloudinaryUrl}
//                                                     alt={doc.originalFileName}
//                                                     className="w-full h-56 object-cover rounded mt-3"
//                                                 />

//                                             )
//                                         }

//                                         <a
//                                             href={doc.cloudinaryUrl}
//                                             target="_blank"
//                                             rel="noreferrer"
//                                             className="text-blue-600 underline mt-3 block"
//                                         >
//                                             View Full Document
//                                         </a>

//                                     </div>

//                                 ))
//                             }

//                         </div>

//                     </div>

//                 )
//             }

//         </div>
//     );
// };

// export default ViewClaim;

import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom'; // useNavigate इम्पोर्ट किया
import { getPolicyByPolicyId } from '../services/policyService';
import {
    getClaimByPolicyId,
    getClaimDocument,
    withdrawClaimById
} from '../services/claimService';
import { toast } from 'react-toastify';
import { downloadClaimHistoryPdf } from '../services/claimHistoryService';
import { 
  FaShieldAlt, FaFileInvoiceDollar, FaFolderOpen, 
  FaDownload, FaHistory, FaPlusCircle, FaTimesCircle, FaFileAlt,
  FaArrowLeft // बैक आइकॉन इम्पोर्ट किया
} from 'react-icons/fa';

const ViewClaim = () => {
    const { policyId } = useParams();
    const navigate = useNavigate(); // Navigation ट्रिगर करने के लिए

    const [planData, setPlanData] = useState({});
    const [claimData, setClaimData] = useState(null);
    const [claimDocuData, setClaimDocuData] = useState([]);
    const [claimId, setClaimId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [withdrawLoading, setWithdrawLoading] = useState(false);

    const getPolicyById = async () => {
        try {
            const data = await getPolicyByPolicyId(policyId);
            setPlanData(data);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed To Load Policy ❌");
        }
    };

    const getClaimData = async () => {
        try {
            const data = await getClaimByPolicyId(policyId);
            const claims = data?.content || [];
            if (claims.length > 0) {
                const latestClaim = claims[claims.length - 1];
                setClaimData(latestClaim);
                setClaimId(latestClaim.claimId);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed To Load Claim ❌");
        }
    };

    const getDocuData = async (id) => {
        try {
            const data = await getClaimDocument(id);
            setClaimDocuData(data || []);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed To Load Documents ❌");
        }
    };

    const withdrawClaim = async () => {
        try {
            setWithdrawLoading(true);
            const data = await withdrawClaimById(claimId);
            setClaimData(data);
            toast.success("Claim Withdrawn Successfully ✅");
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed To Withdraw Claim ❌");
        } finally {
            setWithdrawLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([getPolicyById(), getClaimData()]);
            setLoading(false);
        };
        loadData();
    }, [policyId]);

    useEffect(() => {
        if (claimId) {
            getDocuData(claimId);
        }
    }, [claimId]);

    // Helper utility to convert bytes to human-readable format
    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // Shimmer/Skeleton Loading UI Frame
    if (loading) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto p-2">
                <div className="bg-[#111c30] p-8 rounded-2xl border border-slate-800/80 space-y-4 animate-pulse">
                    <div className="h-6 bg-slate-800 rounded-lg w-1/4"></div>
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                        <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                        <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-800 rounded w-4/5"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-2 text-slate-300">
            
            {/* --- BACK BUTTON CONTROL --- */}
            <div className="flex items-center justify-start">
                <button
                    onClick={() => navigate("/customerdashboard")}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-[#111c30] hover:bg-[#1b2a47] border border-slate-800/80 px-4 py-2.5 rounded-xl transition-all shadow-md"
                >
                    <FaArrowLeft className="text-blue-400 transition-transform group-hover:-translate-x-0.5" /> 
                    Back
                </button>
            </div>

            {/* --- SECTION 1: POLICY SPECIFICATION METRICS --- */}
            <div className="bg-[#111c30] border border-slate-800/90 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/60">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <FaShieldAlt />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">Policy Specification Overview</h2>
                            <p className="text-slate-500 text-xs mt-0.5">Primary policy terms and balance ledgers</p>
                        </div>
                    </div>

                    {planData.policyStatus === "ACTIVE" && (
                        (!claimData || ["APPROVED", "REJECTED", "WITHDRAWN"].includes(claimData.claimStatus))
                    ) && (
                        <NavLink
                            to={`/policy/submitclaim/${planData.policyId}`}
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider uppercase px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/10"
                        >
                            <FaPlusCircle /> Submit New Claim
                        </NavLink>
                    )}
                </div>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm bg-[#070d19]/40 p-5 rounded-2xl border border-slate-800/50">
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium">Customer Holder:</span> <span className="font-semibold text-white">{planData.customerName}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium">Insurance Plan:</span> <span className="font-semibold text-white">{planData.planName}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium">Policy pipeline ID:</span> <span className="font-mono text-xs text-slate-400">#{planData.policyId}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium">Policy Reference No:</span> <span className="font-mono text-xs text-white tracking-wide">{planData.policyNumber}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium">Operational Status:</span> 
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold tracking-wide ${planData.policyStatus === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                            {planData.policyStatus}
                        </span>
                    </p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium">Total Premium Settled:</span> <span className="font-bold text-blue-400">₹{planData.totalPremiumPaid}</span></p>
                    <p className="flex items-center justify-between py-1.5 sm:border-none"><span className="text-slate-500 font-medium">Coverage Commenced:</span> <span className="text-slate-400 text-xs font-medium">{planData.startDate}</span></p>
                    <p className="flex items-center justify-between py-1.5"><span className="text-slate-500 font-medium">Coverage Expiry:</span> <span className="text-slate-400 text-xs font-medium">{planData.endDate}</span></p>
                </div>

                {/* History Analytics Control Triggers */}
                <div className="flex flex-wrap items-center gap-3 mt-6">
                    <NavLink
                        to={`/claim-history/policy/${planData.policyId}`}
                        className="inline-flex items-center gap-2 bg-[#1b2a47] hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                    >
                        <FaHistory className="text-blue-400" /> System Claim History
                    </NavLink>

                    <button
                        onClick={() => downloadClaimHistoryPdf(planData.policyId)}
                        className="inline-flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-transparent text-emerald-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                    >
                        <FaDownload /> Extract PDF Audit Sheet
                    </button>
                </div>
            </div>

            {/* --- SECTION 2: ACTIVE CLAIM MANIFEST LAYER --- */}
            {claimData ? (
                <div className="bg-[#111c30] border border-emerald-500/10 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500/50" />
                    
                    <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/60">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <FaFileInvoiceDollar />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-wide">Active Settlement Manifest</h2>
                                <p className="text-slate-500 text-xs mt-0.5">Latest submitted claim metrics evaluations</p>
                            </div>
                        </div>
                        
                        <span className={`text-xs px-3 py-1 rounded-lg font-black tracking-wider uppercase bg-slate-900 border border-slate-800
                            ${claimData.claimStatus === 'APPROVED' ? 'text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 
                              claimData.claimStatus === 'SUBMITTED' ? 'text-blue-400' : 'text-amber-400'}`}>
                            {claimData.claimStatus}
                        </span>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#070d19]/50 border border-slate-800/60 text-sm">
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim Identifier</span>
                            <span className="font-mono text-xs text-slate-300 font-bold mt-1 block">#{claimData.claimId}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim Document No</span>
                            <span className="font-mono text-xs text-white font-bold mt-1 block">{claimData.claimNumber || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested Liquidation</span>
                            <span className="text-sm text-emerald-400 font-black mt-1 block">₹{claimData.claimAmount}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Evaluation Route</span>
                            <NavLink 
                                to={`/claim-history/claim/${claimData.claimId}`}
                                className="text-xs text-blue-400 underline hover:text-blue-300 transition-colors mt-1 block font-medium"
                            >
                                Lifecycle History Tracker
                            </NavLink>
                        </div>
                        <div className="sm:col-span-2 md:col-span-4 pt-2 border-t border-slate-800/40">
                            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Incident Root Cause Statement</span>
                            <p className="text-xs text-slate-400 leading-relaxed font-serif bg-slate-950/40 p-3 rounded-xl border border-slate-900">{claimData.claimReason}</p>
                        </div>
                    </div>

                    {claimData.claimStatus === "SUBMITTED" && (
                        <button
                            onClick={withdrawClaim}
                            disabled={withdrawLoading}
                            className="mt-5 inline-flex items-center gap-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-transparent text-rose-400 hover:text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all disabled:opacity-40"
                        >
                            {withdrawLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <><FaTimesCircle /> Revoke / Withdraw Claim</>
                            )}
                        </button>
                    )}
                </div>
            ) : (
                /* Empty Framework State */
                <div className="bg-[#111c30] border border-amber-500/10 rounded-2xl p-6 flex items-center gap-4 text-amber-400">
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <FaFolderOpen className="text-sm" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-200">No Active Claims Registered</h3>
                        <p className="text-xs text-slate-500 mt-0.5">There are no operational claim pipelines submitted against this active policy framework.</p>
                    </div>
                </div>
            )}

            {/* --- SECTION 3: UPLOADED VERIFICATION EVIDENCE --- */}
            {claimDocuData.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <FaFileAlt className="text-blue-400 text-sm" />
                        <h2 className="text-lg font-bold text-white tracking-wide">Uploaded Verification Evidence</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        {claimDocuData.map((doc) => (
                            <div
                                key={doc.documentId}
                                className="bg-[#111c30] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between group hover:border-slate-700/80 transition-all relative"
                            >
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-slate-400 font-medium truncate w-4/5">
                                            <span className="text-slate-600 block text-[10px] font-bold uppercase tracking-wider mb-0.5">File System Label</span>
                                            <span className="text-slate-200 font-mono text-xs">{doc.originalFileName}</span>
                                        </p>
                                        <span className="text-[10px] bg-[#070d19] px-2 py-0.5 rounded border border-slate-800 text-slate-400 font-mono uppercase shrink-0">
                                            {doc.contentType?.split('/')?.[1] || 'Doc'}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 bg-[#070d19]/40 p-2.5 rounded-xl border border-slate-900">
                                        <p className="text-slate-500">Mime Type:<span className="block text-slate-300 font-mono mt-0.5">{doc.contentType}</span></p>
                                        <p className="text-slate-500">Allocated Size:<span className="block text-slate-300 font-mono mt-0.5">{formatBytes(doc.sizeInBytes)}</span></p>
                                    </div>

                                    {doc.resourceType === "image" && (
                                        <div className="relative mt-3 rounded-xl overflow-hidden border border-slate-900 bg-slate-950">
                                            <img
                                                src={doc.cloudinaryUrl}
                                                alt={doc.originalFileName}
                                                className="w-full h-44 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                            />
                                        </div>
                                    )}
                                </div>

                                <a
                                    href={doc.cloudinaryUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 w-full py-2.5 text-center bg-[#070d19] hover:bg-blue-600 border border-slate-800 hover:border-transparent text-slate-400 hover:text-white rounded-xl font-bold text-xs tracking-wide transition-all block"
                                >
                                    Inspect Full Asset Media
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewClaim;