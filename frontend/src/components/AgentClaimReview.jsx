
import React, { useEffect, useState } from "react";
import {
    agentClaimReview,
    getClaimById,
    agentRecommendClaimForApproval,
    agentRecommendClaimForRejection,
    getClaimDocument
} from "../services/claimService";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { 
    FaUser, FaEnvelope, FaInfoCircle, FaFileContract, 
    FaShieldAlt, FaRupeeSign, FaCalendarAlt, FaFileAlt, 
    FaTimes, FaCheckCircle, FaBan, FaArrowLeft 
} from "react-icons/fa";

const AgentClaimReview = ({ claimId: modalClaimId, isModal = false, onClose }) => {
    const params = useParams();
    const navigate = useNavigate();
    const claimId = modalClaimId || params.claimId;
    
    const [claimData, setClaimData] = useState({});
    const [claimDocuData, setClaimDocuData] = useState([]);
    const [agentRemark, setAgentRemark] = useState("");
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

const loadClaimData = async () => {
    try {

        const claim = await getClaimById(claimId);

        setClaimData(claim);

    } catch(error){

        toast.error(
          error?.response?.data?.message ||
          "Failed To Load Claim"
        );

    }
};

    const loadDocuments = async () => {
        try {
            const docs = await getClaimDocument(claimId);
            setClaimDocuData(docs || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed To Load Documents ❌");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setPageLoading(true);
                await Promise.all([loadClaimData(), loadDocuments()]);
            } finally {
                setPageLoading(false);
            }
        };
        loadData();
    }, [claimId]);

    const handleApprove = async () => {
        if (!agentRemark.trim()) {
            toast.warning("Please Enter Agent Remark");
            return;
        }
        try {
            setActionLoading(true);
            await agentRecommendClaimForApproval(claimId, agentRemark);
            toast.success("Recommended For Approval ✅");
            if (isModal) {
                onClose?.();
            } else {
                setTimeout(() => navigate("/agentdashboard"), 1000);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed To Recommend Claim ❌");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!agentRemark.trim()) {
            toast.warning("Please Enter Agent Remark");
            return;
        }
        try {
            setActionLoading(true);
            await agentRecommendClaimForRejection(claimId, agentRemark);
            toast.success("Recommended For Rejection ❌");
            if (isModal) {
                onClose?.();
            } else {
                setTimeout(() => navigate("/agentdashboard"), 1000);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed To Reject Claim ❌");
        } finally {
            setActionLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // MAIN CONTENT INTERFACE
    const content = (
        <div className="space-y-6 text-slate-300">
            
            {/* BACK BUTTON (Only shows when it's rendered as a standalone page) */}
            {!isModal && (
                <div className="flex items-center justify-start mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-[#111c30] hover:bg-[#1b2a47] border border-slate-800/80 px-4 py-2.5 rounded-xl transition-all shadow-md"
                    >
                        <FaArrowLeft className="text-blue-400" /> Back
                    </button>
                </div>
            )}

            {/* --- SECTION 1: CLAIM SPECIFICATION DETAILS --- */}
            <div className="bg-[#111c30] border border-slate-800/90 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/60">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <FaShieldAlt />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">Claim Metrics Assessment</h2>
                            <p className="text-slate-500 text-xs mt-0.5">Comprehensive audit overview of the client pipeline</p>
                        </div>
                    </div>

                    <span className={`text-xs px-3 py-1.5 rounded-xl font-black tracking-wider uppercase border bg-[#070d19]/80
                        ${claimData.claimStatus === 'APPROVED' ? 'text-emerald-400 border-emerald-500/30' : 
                          claimData.claimStatus === 'SUBMITTED' ? 'text-blue-400 border-blue-500/30' : 'text-amber-400 border-amber-500/30'}`}>
                        {claimData.claimStatus}
                    </span>
                </div>

                {/* Info Data Matrix Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-sm bg-[#070d19]/40 p-5 rounded-2xl border border-slate-800/50">
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaUser className="text-slate-600 text-xs"/> Customer:</span> <span className="font-semibold text-white">{claimData.customerName}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaEnvelope className="text-slate-600 text-xs"/> Email:</span> <span className="font-semibold text-slate-400 truncate max-w-[180px]">{claimData.customerEmail}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaFileContract className="text-slate-600 text-xs"/> Claim No:</span> <span className="font-mono text-xs text-white tracking-wide">{claimData.claimNumber}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaInfoCircle className="text-slate-600 text-xs"/> Claim ID:</span> <span className="font-mono text-xs text-slate-400">#{claimData.claimId}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaInfoCircle className="text-slate-600 text-xs"/> Policy ID:</span> <span className="font-mono text-xs text-slate-400">#{claimData.policyId}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaShieldAlt className="text-slate-600 text-xs"/> Plan Name:</span> <span className="font-semibold text-white">{claimData.planName}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaRupeeSign className="text-slate-600 text-xs"/> Coverage:</span> <span className="font-bold text-slate-200">₹{claimData.coverageAmount}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaRupeeSign className="text-slate-600 text-xs"/> Premium:</span> <span className="font-bold text-slate-200">₹{claimData.premiumAmount}</span></p>
                    <p className="flex items-center justify-between py-1.5 border-b border-slate-800/30"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaRupeeSign className="text-slate-600 text-xs"/> Request Liquidation:</span> <span className="font-black text-emerald-400">₹{claimData.claimAmount}</span></p>
                    <p className="flex items-center justify-between py-1.5 sm:border-none"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaCalendarAlt className="text-slate-600 text-xs"/> Policy Commenced:</span> <span className="text-slate-400 text-xs font-medium">{claimData.policyStartDate}</span></p>
                    <p className="flex items-center justify-between py-1.5"><span className="text-slate-500 font-medium inline-flex items-center gap-2"><FaCalendarAlt className="text-slate-600 text-xs"/> Policy Expiry:</span> <span className="text-slate-400 text-xs font-medium">{claimData.policyEndDate}</span></p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/40">
                    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Incident Root Cause Statement</span>
                    <p className="text-xs text-slate-400 leading-relaxed font-serif bg-[#070d19]/50 p-4 rounded-xl border border-slate-900">{claimData.claimReason}</p>
                </div>
            </div>

            {/* --- SECTION 2: VERIFICATION EVIDENCE ASSETS --- */}
            <div className="bg-[#111c30] border border-slate-800/90 rounded-3xl shadow-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800/60">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <FaFileAlt />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-wide">Verification Dossier</h2>
                        <p className="text-slate-500 text-xs mt-0.5">Uploaded file architecture for claim authenticity</p>
                    </div>
                </div>

                {claimDocuData.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-5">
                        {claimDocuData.map((doc) => (
                            <div key={doc.documentId} className="bg-[#070d19]/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between group hover:border-slate-700/80 transition-all">
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-slate-400 font-medium truncate w-4/5">
                                            <span className="text-slate-600 block text-[10px] font-bold uppercase tracking-wider mb-0.5">File Label</span>
                                            <span className="text-slate-200 font-mono text-xs">{doc.originalFileName}</span>
                                        </p>
                                        <span className="text-[10px] bg-[#111c30] px-2 py-0.5 rounded border border-slate-800 text-slate-400 font-mono uppercase shrink-0">
                                            {doc.contentType?.split('/')?.[1] || 'Doc'}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 font-mono text-[11px]">System ID: <span className="text-slate-400">#{doc.documentId}</span></p>

                                    {doc.resourceType === "image" && (
                                        <div className="relative mt-3 rounded-xl overflow-hidden border border-slate-900 bg-slate-950">
                                            <img
                                                src={doc.cloudinaryUrl}
                                                alt={doc.originalFileName}
                                                className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                            />
                                        </div>
                                    )}
                                </div>

                                <a
                                    href={doc.cloudinaryUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 w-full py-2 text-center bg-[#111c30] hover:bg-blue-600 border border-slate-800 hover:border-transparent text-slate-400 hover:text-white rounded-xl font-bold text-xs tracking-wide transition-all block"
                                >
                                    View Full Asset
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-5 bg-[#070d19]/30 rounded-2xl border border-slate-800/40 text-center">
                        <p className="text-slate-500 text-sm">No validation documents accompanied this claim manifest.</p>
                    </div>
                )}
            </div>

            {/* --- SECTION 3: AGENT REVIEW & SUBMISSION REMARK --- */}
            <div className="bg-[#111c30] border border-slate-800/90 rounded-3xl shadow-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white tracking-wide mb-2">Agent Evaluation Desk</h2>
                <p className="text-slate-500 text-xs mb-4">Mandatory analytical log required before operational routing decision</p>

                <textarea
                    rows="4"
                    value={agentRemark}
                    onChange={(e) => setAgentRemark(e.target.value)}
                    className="w-full rounded-xl bg-[#070d19]/60 border border-slate-800 text-sm p-4 text-slate-200 outline-none focus:border-blue-500/50 placeholder-slate-600 resize-none transition-all"
                    placeholder="Enter thorough analysis logs and metrics breakdown..."
                />

                <div className="flex flex-wrap sm:flex-nowrap gap-4 mt-6">
                    <button
                        disabled={actionLoading}
                        onClick={handleApprove}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-transparent text-emerald-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 shadow-lg shadow-emerald-950/20"
                    >
                        {actionLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <><FaCheckCircle /> Recommend Approval</>
                        )}
                    </button>

                    <button
                        disabled={actionLoading}
                        onClick={handleReject}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-transparent text-rose-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 shadow-lg shadow-rose-950/20"
                    >
                        {actionLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <><FaBan /> Recommend Rejection</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    // RENDER: STANDALONE FULL PAGE
    if (!isModal) {
        return (
            <div className="min-h-screen bg-[#070d19] p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    {content}
                </div>
            </div>
        );
    }

    // RENDER: DIALOG MODAL FRAMEWAY
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
            <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#070d19] shadow-2xl p-6 relative" >
                
                {/* Modal Header Controls */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/60">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-wide">Claim Pipeline Workspace</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Execute systematic evaluation and validation protocols</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-rose-600/20 hover:border-rose-500/30 transition-all flex items-center justify-center"
                    >
                        <FaTimes className="text-sm" />
                    </button>
                </div>
                
                {content}
            </div>
        </div>
    );
};

export default AgentClaimReview;