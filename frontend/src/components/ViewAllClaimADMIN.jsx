import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    getAllClaims,
    adminApproveClaim,
    adminRejectClaim
} from '../services/claimService';
import { toast } from 'react-toastify';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, FileText, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ViewAllClaimADMIN = () => {
    const role = useSelector((state) => state.auth.role) || localStorage.getItem("role");

    const [claims, setClaims] = useState([]);
    const [remarks, setRemarks] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // Search, Filter, Pagination States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(0); // 0-indexed for backend API
    const [totalPages, setTotalPages] = useState(1);
    const [totalClaimsCount, setTotalClaimsCount] = useState(0);
    const pageSize = 10;

    const fetchClaims = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllClaims(currentPage, pageSize);
            setClaims(data?.content || []);
            setTotalPages(data?.totalPages || 1);
            setTotalClaimsCount(data?.totalElements || 0);
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Claims ❌"
            );
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchClaims();
    }, [fetchClaims]);

    const handleApprove = async (claimId) => {
        if (!remarks[claimId] || !remarks[claimId].trim()) {
            toast.warning("Please Enter Admin Remark");
            return;
        }

        try {
            setActionLoading(claimId);
            await adminApproveClaim(claimId, remarks[claimId]);
            toast.success("Claim Approved Successfully ✅");
            
            // Clear remark input
            setRemarks(prev => {
                const updated = { ...prev };
                delete updated[claimId];
                return updated;
            });

            fetchClaims();
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message ||
                "Failed To Approve Claim ❌"
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (claimId) => {
        if (!remarks[claimId] || !remarks[claimId].trim()) {
            toast.warning("Please Enter Admin Remark");
            return;
        }

        try {
            setActionLoading(claimId);
            await adminRejectClaim(claimId, remarks[claimId]);
            toast.success("Claim Rejected Successfully ❌");
            
            // Clear remark input
            setRemarks(prev => {
                const updated = { ...prev };
                delete updated[claimId];
                return updated;
            });

            fetchClaims();
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message ||
                "Failed To Reject Claim ❌"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // Client-side search and status filter on top of the paginated chunk
    const filteredClaims = useMemo(() => {
        return claims.filter((claim) => {
            const matchesSearch = 
                claim.claimNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                claim.claimReason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(claim.claimId).includes(searchQuery);

            const matchesStatus = 
                selectedStatus === "all"
                    ? true
                    : claim.claimStatus === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [claims, searchQuery, selectedStatus]);

    if (loading && claims.length === 0) {
        return (
          <div className="p-6 space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse"></div>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        );
    }

    return (
        <div className="space-y-6 text-slate-700 dark:text-slate-200">
            {/* PAGE HEADER */}
            <div>
                <h1 className="text-2xl font-black text-slate-850 dark:text-white">
                    Claims Manager
                </h1>
                <p className="text-xs text-slate-450 mt-0.5">
                    Review, audit, and approve/reject claims recommended by operative agents.
                </p>
            </div>

            {/* FILTER TOOLBAR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative flex items-center">
                  <Search size={18} className="absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by claim number, ID, or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="all">All Claims Status</option>
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="UNDER_PROCESS">UNDER_PROCESS</option>
                  <option value="RECOMMENDED_FOR_APPROVAL">RECOMMENDED_FOR_APPROVAL</option>
                  <option value="RECOMMENDED_FOR_REJECTION">RECOMMENDED_FOR_REJECTION</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
            </div>

            {/* CLAIMS LIST */}
            {filteredClaims.length > 0 ? (
                <div className="space-y-4">
                    {filteredClaims.map((claim) => (
                        <motion.div
                            key={claim.claimId}
                            layout
                            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase block mb-1">Claim Metadata</span>
                                    <div className="space-y-1 text-sm font-semibold">
                                        <p className="text-slate-800 dark:text-slate-200">
                                            ID: <span className="font-mono text-slate-500 text-xs">#{claim.claimId}</span>
                                        </p>
                                        <p className="text-slate-800 dark:text-slate-200">
                                            Number: <span className="text-slate-500 text-xs font-mono">{claim.claimNumber}</span>
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase block mb-1">Claim Metrics</span>
                                    <div className="space-y-1 text-sm">
                                        <p className="font-bold text-slate-800 dark:text-slate-250">
                                            Amount: <span className="text-emerald-600 dark:text-emerald-400">₹{claim.claimAmount}</span>
                                        </p>
                                        <p className="text-xs text-slate-450 font-medium">
                                            Reason: <span className="text-slate-650 dark:text-slate-300 font-semibold">{claim.claimReason}</span>
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase block mb-1">Current State</span>
                                    <div>
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                                                claim.claimStatus === "APPROVED"
                                                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-450 dark:bg-emerald-950/30"
                                                    : claim.claimStatus === "REJECTED"
                                                    ? "text-rose-600 bg-rose-50 dark:text-rose-450 dark:bg-rose-950/30"
                                                    : claim.claimStatus === "RECOMMENDED_FOR_APPROVAL"
                                                    ? "text-blue-600 bg-blue-50 dark:text-blue-450 dark:bg-blue-950/30"
                                                    : claim.claimStatus === "RECOMMENDED_FOR_REJECTION"
                                                    ? "text-amber-600 bg-amber-50 dark:text-amber-450 dark:bg-amber-950/30"
                                                    : "text-yellow-600 bg-yellow-50 dark:text-yellow-450 dark:bg-yellow-950/30"
                                            }`}
                                        >
                                            {claim.claimStatus === "APPROVED" && <CheckCircle size={13} />}
                                            {claim.claimStatus === "REJECTED" && <XCircle size={13} />}
                                            {claim.claimStatus?.startsWith("RECOMMENDED") && <AlertCircle size={13} />}
                                            {!["APPROVED", "REJECTED"].includes(claim.claimStatus) && !claim.claimStatus?.startsWith("RECOMMENDED") && <Clock size={13} />}
                                            {claim.claimStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ADMIN AUDIT ACTION PANEL (Only visible to ADMIN role) */}
                            {role === "ADMIN" && (claim.claimStatus === "RECOMMENDED_FOR_APPROVAL" || claim.claimStatus === "RECOMMENDED_FOR_REJECTION") && (
                                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Audit remarks</label>
                                        <textarea
                                            rows="3"
                                            className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-slate-850 dark:text-white"
                                            placeholder="Write admin audit details and feedback..."
                                            value={remarks[claim.claimId] || ""}
                                            onChange={(e) =>
                                                setRemarks({
                                                    ...remarks,
                                                    [claim.claimId]: e.target.value
                                                })
                                            }
                                        />
                                    </div>

                                   <div className="flex gap-3">

    <button
        disabled={actionLoading === claim.claimId}
        onClick={() => handleApprove(claim.claimId)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition active:scale-95 disabled:opacity-50"
    >
        {actionLoading === claim.claimId 
            ? "Processing..." 
            : "Approve Claim"
        }
    </button>


    <button
        disabled={actionLoading === claim.claimId}
        onClick={() => handleReject(claim.claimId)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition active:scale-95 disabled:opacity-50"
    >
        {actionLoading === claim.claimId 
            ? "Processing..." 
            : "Reject Claim"
        }
    </button>

</div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <FileText size={32} className="mx-auto text-slate-300 dark:text-slate-650 mb-2" />
                    <h3 className="text-base font-bold text-slate-600 dark:text-slate-450">No Claims Found</h3>
                    <p className="text-xs text-slate-400 mt-1">There are no claim entries matching your search/filters.</p>
                </div>
            )}

            {/* SERVER PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <p className="text-xs text-slate-455">
                        Total records: <span className="font-semibold text-slate-700 dark:text-slate-350">{totalClaimsCount}</span> claims
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                            disabled={currentPage === 0 || loading}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-650 disabled:opacity-40 disabled:hover:bg-transparent hover:bg-slate-50 transition"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-semibold px-3 py-1 text-slate-650">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                            disabled={currentPage === totalPages - 1 || loading}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-650 disabled:opacity-40 disabled:hover:bg-transparent hover:bg-slate-50 transition"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAllClaimADMIN;