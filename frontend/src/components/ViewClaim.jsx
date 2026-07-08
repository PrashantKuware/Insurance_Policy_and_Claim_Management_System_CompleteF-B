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
import { checkReviewExists, submitReviewByCustomer } from '../services/reviewService';
import HoverRating from './HoverRating';

const ViewClaim = () => {
    const { policyId } = useParams();
    const navigate = useNavigate(); // Navigation ट्रिगर करने के लिए

    const [planData, setPlanData] = useState({});
    const [claimData, setClaimData] = useState(null);
    const [claimDocuData, setClaimDocuData] = useState([]);
    const [ratingValue, setRatingValue] = useState(0)
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);
    const [claimId, setClaimId] = useState(null);
    const [formData, setFormData] = useState({
        policyId: "",
        rating: "",
        comment: ""
    })

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

    const submitReview = async () => {
    try {
        const reviewData = {
            ...formData,
            rating: ratingValue,
            policyId: planData.policyId
        };

        await submitReviewByCustomer(reviewData);

        toast.success("Review Submitted Successfully ✅");
        setAlreadyReviewed(true);

        setFormData({
            policyId: "",
            rating: "",
            comment: ""
        });

    } catch (error) {
        if (
            error?.response?.data?.message?.includes("already reviewed")
        ) {
            setAlreadyReviewed(true);
        }

        toast.error(
            error?.response?.data?.message ||
            "Failed to Submit Review ❌"
        );
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
    const loadReviewStatus = async () => {
        try {
            const data = await checkReviewExists(policyId);
            setAlreadyReviewed(data);
        } catch (error) {
            console.log(error);
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

        if (policyId) {
            loadReviewStatus();
        }
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

                {planData.policyStatus === "ACTIVE" && (
                    alreadyReviewed ? (
                        <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                            <h3 className="text-emerald-400 font-bold text-lg">
                                Review Already Submitted
                            </h3>

                            <p className="text-slate-400 text-sm mt-2">
                                You have already submitted a review for this policy.
                            </p>
                        </div>
                    ) :
                        <div className="bg-[#111c30] border border-slate-800/80 rounded-3xl p-6 shadow-2xl">
                            <div className="mb-5">
                                <h2 className="text-xl font-bold text-white">
                                    Submit Review
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">
                                    Share your experience about this insurance plan
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* <select
                                    value={formData.rating}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            rating: e.target.value,
                                            policyId: planData.policyId,
                                        })
                                    }
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white"
                                >
                                    <option value="">Select Rating</option>
                                    <option value="1">⭐ 1</option>
                                    <option value="2">⭐⭐ 2</option>
                                    <option value="3">⭐⭐⭐ 3</option>
                                    <option value="4">⭐⭐⭐⭐ 4</option>
                                    <option value="5">⭐⭐⭐⭐⭐ 5</option>
                                </select> */}

                                {/* <div className=''>
                                    <h1>Rating</h1> */}
                                <HoverRating setValues={setRatingValue} />
                                {/* </div> */}

                                <textarea
                                    rows="4"
                                    value={formData.comment}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            comment: e.target.value,
                                            policyId: planData.policyId,
                                        })
                                    }
                                    placeholder="Write your review..."
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white resize-none"
                                />

                                <button
                                    onClick={() => submitReview(formData)}
                                    className="px-6 py-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-600 hover:text-white transition-all font-bold"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                )}
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