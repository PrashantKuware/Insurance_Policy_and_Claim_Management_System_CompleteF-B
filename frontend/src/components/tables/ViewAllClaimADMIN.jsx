import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    getAllClaims,
    adminApproveClaim,
    adminRejectClaim,
    getClaimDocument
} from '../../services/claimService';
import { getClaimHistoryByClaimId } from '../../services/claimHistoryService';
import { getAllUsers } from '../../services/userService';
import { getPolicyByPolicyId } from '../../services/policyService';
import { toast } from 'react-toastify';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, FileText, AlertCircle, Clock, Info, User, Shield, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ViewAllClaimADMIN = () => {
    const role = useSelector((state) => state.auth.role) || localStorage.getItem("role");

    const [claims, setClaims] = useState([]);
    const [remarks, setRemarks] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // Directory list for users/agents
    const [usersList, setUsersList] = useState([]);

    // Modal Details States
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [modalDocs, setModalDocs] = useState([]);
    const [modalPolicy, setModalPolicy] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

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
            const rawClaims = data?.content || [];

            // Fetch users to match Agent & Customer details
            let users = [];
            try {
                users = await getAllUsers();
            } catch (err) {
                console.warn("Failed to fetch users list (likely unauthorized AGENT role)", err);
            }
            setUsersList(users || []);
            const agents = (users || []).filter(u => u.role === "AGENT");

            // Enhance each claim on the current page with status history and agent info
            const enhancedClaims = await Promise.all(
                rawClaims.map(async (claim) => {
                    try {
                        const history = await getClaimHistoryByClaimId(claim.claimId);

                        // Find transition performed by agent
                        const agentTransition = history.find(h =>
                            h.newStatus === "RECOMMENDED_FOR_APPROVAL" ||
                            h.newStatus === "RECOMMENDED_FOR_REJECTION" ||
                            h.newStatus === "UNDER_REVIEW"
                        );

                        if (agentTransition && agentTransition.updatedBy !== "SYSTEM") {
                            const matchedAgent = agents.find(a =>
                                a.fullName?.toLowerCase() === agentTransition.updatedBy?.toLowerCase()
                            );
                            return {
                                ...claim,
                                agentInfo: {
                                    name: agentTransition.updatedBy,
                                    id: matchedAgent?.userId || "N/A",
                                    email: matchedAgent?.email || "N/A",
                                    date: agentTransition.updatedDate,
                                    status: agentTransition.newStatus,
                                    remarks: agentTransition.remarks
                                },
                                claimHistory: history
                            };
                        }
                        return { ...claim, agentInfo: null, claimHistory: history };
                    } catch (e) {
                        console.error("Failed to load history for claim " + claim.claimId, e);
                        return { ...claim, agentInfo: null, claimHistory: [] };
                    }
                })
            );

            setClaims(enhancedClaims);
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

            // Close details modal if open
            setSelectedClaim(null);

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

            // Close details modal if open
            setSelectedClaim(null);

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

    const handleOpenDetails = async (claim) => {
        setSelectedClaim(claim);
        setModalDocs([]);
        setModalPolicy(null);
        try {
            setModalLoading(true);
            const [docs, policy] = await Promise.all([
                getClaimDocument(claim.claimId),
                getPolicyByPolicyId(claim.policyId)
            ]);
            setModalDocs(docs || []);
            setModalPolicy(policy);
        } catch (e) {
            console.error("Failed to load claim details modal", e);
        } finally {
            setModalLoading(false);
        }
    };

    // Customer profile correlation in modal
    const matchedCustomerUser = useMemo(() => {
        if (!selectedClaim) return null;
        return usersList.find(u => u.email?.toLowerCase() === selectedClaim.customerEmail?.toLowerCase());
    }, [selectedClaim, usersList]);

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
                <p className="text-xs text-slate-455 mt-0.5">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                        <p className="text-xs text-slate-450 font-medium truncate max-w-[200px]">
                                            Reason: <span className="text-slate-650 dark:text-slate-300 font-semibold">{claim.claimReason}</span>
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase block mb-1">Responsible Agent</span>
                                    <div className="text-xs space-y-0.5">
                                        {claim.agentInfo ? (
                                            <>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">{claim.agentInfo.name}</p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">ID: #{claim.agentInfo.id}</p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{claim.agentInfo.email}</p>
                                                {claim.agentInfo.date && (
                                                    <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 font-semibold">
                                                        Date: <span className="font-mono font-medium">{new Date(claim.agentInfo.date).toLocaleDateString()}</span>
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-slate-400 italic">No agent recommendation</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase block mb-1">Current State</span>
                                    <div className="flex flex-col gap-2 items-start">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${claim.claimStatus === "APPROVED"
                                                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-450 dark:bg-emerald-950/30"
                                                    : claim.claimStatus === "REJECTED"
                                                        ? "text-rose-600 bg-rose-50 dark:text-rose-455 dark:bg-rose-950/30"
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

                                        <button
                                            onClick={() => handleOpenDetails(claim)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white border border-blue-200 dark:border-blue-900/30 transition-all duration-200 cursor-pointer"
                                        >
                                            <Info size={12} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-655 disabled:opacity-40 disabled:hover:bg-transparent hover:bg-slate-50 transition"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-semibold px-3 py-1 text-slate-655">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                            disabled={currentPage === totalPages - 1 || loading}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-655 disabled:opacity-40 disabled:hover:bg-transparent hover:bg-slate-50 transition"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* CLAIM DETAILS MODAL */}
            <AnimatePresence>
                {selectedClaim && (
                    <div className="
fixed
inset-0
z-50
flex
items-start
md:items-center
justify-center
p-4
bg-slate-950/50
backdrop-blur-sm
overflow-y-auto
">                       <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.2 }}
                            className="
    relative
    w-full
    max-w-4xl
    max-h-[90vh]
    overflow-y-auto
    bg-white
    dark:bg-slate-900
    border
    border-slate-200
    dark:border-slate-800
    rounded-3xl
    p-6
    md:p-8
    shadow-2xl
    space-y-6
    text-slate-800
    dark:text-white
    my-8
    "
                        >

                            {/* Modal Close Button */}
                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
                            >
                                <X size={18} />
                            </button>

                            <div>
                                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase">
                                    Audit Specifications
                                </span>
                                <h2 className="text-xl font-extrabold mt-3 text-slate-900 dark:text-white">
                                    Claim #{selectedClaim.claimId} <span className="font-mono text-sm text-slate-400 font-medium">({selectedClaim.claimNumber})</span>
                                </h2>
                            </div>

                            {modalLoading ? (
                                <div className="text-center py-12 animate-pulse text-sm text-slate-400">Loading audit details...</div>
                            ) : (
                                <div className="space-y-6 text-sm">

                                    {/* SECTION 1: CLAIM SPECIFICS */}
                                    <div className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl p-5 space-y-4">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Claim Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <span className="text-[10px] text-slate-400 block mb-0.5">Claim Amount</span>
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">₹{selectedClaim.claimAmount}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block mb-0.5">Status</span>
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedClaim.claimStatus === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                                                        selectedClaim.claimStatus === "REJECTED" ? "bg-rose-500/10 text-rose-500" :
                                                            "bg-yellow-500/10 text-yellow-550 dark:text-yellow-400"
                                                    }`}>
                                                    {selectedClaim.claimStatus}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block mb-0.5">Submission Date</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {selectedClaim.claimHistory?.[0]?.updatedDate
                                                        ? new Date(selectedClaim.claimHistory[0].updatedDate).toLocaleDateString()
                                                        : "N/A"
                                                    }
                                                </span>
                                            </div>
                                            <div className="md:col-span-3">
                                                <span className="text-[10px] text-slate-400 block mb-0.5">Claim Reason & Description</span>
                                                <span className="font-semibold text-slate-700 dark:text-slate-350">{selectedClaim.claimReason}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 2: CLIENT & AGENT METADATA */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                        {/* CUSTOMER CARD */}
                                        <div className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl p-5 space-y-3">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <User size={15} />
                                                <h3 className="text-xs font-bold uppercase tracking-wider">Customer Info</h3>
                                            </div>
                                            <div className="space-y-2 text-xs">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 block mb-0.5">Full Name</span>
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedClaim.customerName}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 block mb-0.5">Email Address</span>
                                                    <span className="font-semibold text-slate-850 dark:text-slate-300">{selectedClaim.customerEmail}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 block mb-0.5">Phone Number</span>
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{matchedCustomerUser?.mobileNumber || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AGENT CARD */}
                                        <div className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl p-5 space-y-3">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Shield size={15} />
                                                <h3 className="text-xs font-bold uppercase tracking-wider">Agent Info</h3>
                                            </div>
                                            {selectedClaim.agentInfo ? (
                                                <div className="space-y-2 text-xs">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block mb-0.5">Name & ID</span>
                                                        <span className="font-bold text-slate-805 dark:text-slate-200">
                                                            {selectedClaim.agentInfo.name} <span className="font-mono text-[10px] text-slate-450 font-normal">(#{selectedClaim.agentInfo.id})</span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block mb-0.5">Email</span>
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedClaim.agentInfo.email}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block mb-0.5">Recommendation</span>
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                            Status: <span className="font-bold text-blue-600 dark:text-blue-400">{selectedClaim.agentInfo.status}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="py-4 text-center text-slate-400 text-xs italic">
                                                    No responsible agent assigned yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* SECTION 3: POLICY DETAILS */}
                                    <div className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl p-5 space-y-4">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Policy Details</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                            <div>
                                                <span className="text-[10px] text-slate-400 block mb-0.5">Policy Number</span>
                                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{modalPolicy?.policyNumber || "N/A"}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block mb-0.5">Plan Name</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedClaim.planName}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block mb-0.5">Total Premium</span>
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{selectedClaim.premiumAmount}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block mb-0.5">Max Coverage</span>
                                                <span className="font-bold text-blue-600 dark:text-blue-400">₹{selectedClaim.coverageAmount}</span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-[10px] text-slate-400 block mb-0.5">Policy Coverage Period</span>
                                                <span className="font-semibold text-slate-700 dark:text-slate-350">
                                                    {selectedClaim.policyStartDate ? new Date(selectedClaim.policyStartDate).toLocaleDateString() : "N/A"} to {selectedClaim.policyEndDate ? new Date(selectedClaim.policyEndDate).toLocaleDateString() : "N/A"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block mb-0.5">Policy Status</span>
                                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${modalPolicy?.policyStatus === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                                    }`}>
                                                    {modalPolicy?.policyStatus || "PENDING"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 4: DOCUMENTS UPLOADS */}
                                    <div className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl p-5 space-y-3">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Uploaded Verification Documents</h3>
                                        {modalDocs.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {modalDocs.map((doc) => (
                                                    <div
                                                        key={doc.documentId}
                                                        className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                                                    >
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <FileText size={16} className="text-blue-500 shrink-0" />
                                                            <span className="text-xs font-bold truncate max-w-[200px] text-slate-800 dark:text-slate-200" title={doc.originalFileName}>
                                                                {doc.originalFileName}
                                                            </span>
                                                        </div>
                                                        <a
                                                            href={doc.cloudinaryUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-1 rounded bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-600 dark:text-blue-400 transition"
                                                        >
                                                            <Download size={14} />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-4 text-center text-slate-405 text-xs italic">
                                                No supporting documents uploaded for this claim.
                                            </div>
                                        )}
                                    </div>

                                    {/* CLAIM HISTORY */}

                                    <div className="
border border-slate-100
dark:border-slate-800
bg-slate-50/50
dark:bg-slate-950/40
rounded-2xl
p-5
space-y-3
">

                                        <h3 className="
text-xs
font-bold
text-slate-400
uppercase
tracking-wider
flex
items-center
gap-2
">

                                            <Clock size={15} />

                                            Claim History

                                        </h3>


                                        {
                                            selectedClaim.claimHistory?.length > 0
                                                ?

                                                <div className="space-y-3 mt-4">

                                                    {
                                                        selectedClaim.claimHistory.map(
                                                            (history, index) => (

                                                                <div
                                                                    key={index}
                                                                    className="
border-l-4
border-blue-500
pl-4
"
                                                                >

                                                                    <p className="
font-bold
text-sm
text-slate-800
dark:text-white
">

                                                                        {history.newStatus}

                                                                    </p>


                                                                    <p className="
text-xs
text-slate-500
">

                                                                        Updated By :
                                                                        {" "}
                                                                        {history.updatedBy || "SYSTEM"}

                                                                    </p>


                                                                    <p className="
text-xs
text-slate-400
">

                                                                        {
                                                                            history.updatedDate
                                                                                ?
                                                                                new Date(history.updatedDate)
                                                                                    .toLocaleString()
                                                                                :
                                                                                "N/A"
                                                                        }

                                                                    </p>


                                                                    {
                                                                        history.remarks &&
                                                                        <p className="
text-xs
text-slate-500
mt-1
">

                                                                            Remark :
                                                                            {history.remarks}

                                                                        </p>
                                                                    }


                                                                </div>

                                                            )

                                                        )

                                                    }

                                                </div>

                                                :

                                                <p className="
text-sm
text-slate-500
mt-3
">

                                                    No history found

                                                </p>

                                        }


                                    </div>

                                    {/* AUDIT FORM IN MODAL */}
                                    {role === "ADMIN" && (selectedClaim.claimStatus === "RECOMMENDED_FOR_APPROVAL" || selectedClaim.claimStatus === "RECOMMENDED_FOR_REJECTION") && (
                                        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Audit remarks</label>
                                                <textarea
                                                    rows="2"
                                                    className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-slate-850 dark:text-white"
                                                    placeholder="Write admin audit details and feedback..."
                                                    value={remarks[selectedClaim.claimId] || ""}
                                                    onChange={(e) =>
                                                        setRemarks({
                                                            ...remarks,
                                                            [selectedClaim.claimId]: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* <div className="flex gap-3 justify-end">
                                                {selectedClaim.claimStatus === "RECOMMENDED_FOR_APPROVAL" && (
                                                    <button
                                                        disabled={actionLoading === selectedClaim.claimId}
                                                        onClick={() => handleApprove(selectedClaim.claimId)}
                                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition active:scale-97 disabled:opacity-50"
                                                    >
                                                        {actionLoading === selectedClaim.claimId ? "Processing..." : "Confirm Approval"}
                                                    </button>
                                                )}

                                                {selectedClaim.claimStatus === "RECOMMENDED_FOR_REJECTION" && (
                                                    <button
                                                        disabled={actionLoading === selectedClaim.claimId}
                                                        onClick={() => handleReject(selectedClaim.claimId)}
                                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition active:scale-97 disabled:opacity-50"
                                                    >
                                                        {actionLoading === selectedClaim.claimId ? "Processing..." : "Confirm Rejection"}
                                                    </button>
                                                )}
                                            </div> */}
                                            <div className="flex gap-3 justify-end">

                                                {/* APPROVE BUTTON */}
                                                <button
                                                    disabled={actionLoading === selectedClaim.claimId}
                                                    onClick={() => handleApprove(selectedClaim.claimId)}
                                                    className="
        inline-flex items-center gap-2
        px-5 py-2.5
        rounded-xl
        bg-emerald-600
        hover:bg-emerald-700
        text-white
        font-semibold
        text-xs
        transition
        disabled:opacity-50
        "
                                                >

                                                    <CheckCircle size={15} />

                                                    {
                                                        actionLoading === selectedClaim.claimId
                                                            ?
                                                            "Processing..."
                                                            :
                                                            "Approve Claim"
                                                    }

                                                </button>


                                                {/* REJECT BUTTON */}
                                                <button
                                                    disabled={actionLoading === selectedClaim.claimId}
                                                    onClick={() => handleReject(selectedClaim.claimId)}
                                                    className="
        inline-flex items-center gap-2
        px-5 py-2.5
        rounded-xl
        bg-rose-600
        hover:bg-rose-700
        text-white
        font-semibold
        text-xs
        transition
        disabled:opacity-50
        "
                                                >

                                                    <XCircle size={15} />

                                                    {
                                                        actionLoading === selectedClaim.claimId
                                                            ?
                                                            "Processing..."
                                                            :
                                                            "Reject Claim"
                                                    }

                                                </button>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={() => setSelectedClaim(null)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition active:scale-97"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ViewAllClaimADMIN;


// import React, {
//     useEffect,
//     useState,
//     useCallback,
//     useMemo
// } from "react";

// import { useSelector } from "react-redux";

// import {
//     getAllClaims,
//     adminApproveClaim,
//     adminRejectClaim,
//     getClaimDocument
// } from "../../services/claimService";

// import {
//     getClaimHistoryByClaimId
// } from "../../services/claimHistoryService";

// import {
//     getAllUsers
// } from "../../services/userService";

// import {
//     getPolicyByPolicyId
// } from "../../services/policyService";

// import {
//     toast
// } from "react-toastify";


// import {
//     Search,
//     ChevronLeft,
//     ChevronRight,
//     CheckCircle,
//     XCircle,
//     FileText,
//     AlertCircle,
//     Clock,
//     Info,
//     User,
//     Shield,
//     X,
//     Download
// } from "lucide-react";


// import {
//     motion,
//     AnimatePresence
// } from "framer-motion";



// const ViewAllClaimADMIN = () => {


// const role =
// useSelector(
// (state)=>state.auth.role
// )
// ||
// localStorage.getItem("role");



// const [claims,setClaims] = useState([]);

// const [remarks,setRemarks] = useState({});

// const [loading,setLoading] = useState(true);

// const [actionLoading,setActionLoading] = useState(null);



// const [usersList,setUsersList] = useState([]);



// // Modal

// const [selectedClaim,setSelectedClaim] = useState(null);

// const [modalDocs,setModalDocs] = useState([]);

// const [modalPolicy,setModalPolicy] = useState(null);

// const [modalLoading,setModalLoading] = useState(false);



// // Filter

// const [searchQuery,setSearchQuery] = useState("");

// const [selectedStatus,setSelectedStatus] = useState("all");



// // Pagination

// const [currentPage,setCurrentPage] = useState(0);

// const [totalPages,setTotalPages] = useState(1);

// const [totalClaimsCount,setTotalClaimsCount] = useState(0);


// const pageSize = 10;




// // ================= FETCH =================


// const fetchClaims = useCallback(async()=>{


// try{


// setLoading(true);



// const response =
// await getAllClaims(
// currentPage,
// pageSize
// );



// const data =
// response?.content || [];



// let users=[];


// try{

// users =
// await getAllUsers();

// }
// catch(error){

// console.log(
// "User fetch failed",
// error
// );

// }



// setUsersList(users);



// const agents =
// users.filter(
// user=>user.role==="AGENT"
// );



// const finalClaims =
// await Promise.all(

// data.map(async(claim)=>{


// try{


// const history =
// await getClaimHistoryByClaimId(
// claim.claimId
// );



// const agentHistory =
// history.find(
// h=>

// h.newStatus ===
// "RECOMMENDED_FOR_APPROVAL"

// ||

// h.newStatus ===
// "RECOMMENDED_FOR_REJECTION"

// );



// let agentInfo=null;



// if(agentHistory){


// const agent =
// agents.find(

// a=>

// a.fullName?.toLowerCase()
// ===

// agentHistory.updatedBy
// ?.toLowerCase()

// );



// agentInfo={

// name:
// agentHistory.updatedBy,

// id:
// agent?.userId || "N/A",

// email:
// agent?.email || "N/A",

// date:
// agentHistory.updatedDate,

// status:
// agentHistory.newStatus

// };


// }



// return {

// ...claim,

// agentInfo,

// claimHistory:
// history

// };



// }
// catch(error){


// return {

// ...claim,

// agentInfo:null,

// claimHistory:[]

// };


// }



// })

// );



// setClaims(finalClaims);



// setTotalPages(
// response?.totalPages || 1
// );


// setTotalClaimsCount(
// response?.totalElements || 0
// );



// }
// catch(error){


// toast.error(
// error?.response?.data?.message
// ||
// "Failed To Load Claims ❌"
// );


// }
// finally{

// setLoading(false);

// }



// },[currentPage]);





// useEffect(()=>{

// fetchClaims();

// },[fetchClaims]);






// // ================= APPROVE =================


// const handleApprove =
// async(claimId)=>{


// if(
// !remarks[claimId]
// ||
// !remarks[claimId].trim()
// ){

// toast.warning(
// "Please Enter Admin Remark"
// );

// return;

// }



// try{


// setActionLoading(claimId);



// await adminApproveClaim(

// claimId,

// remarks[claimId]

// );



// toast.success(
// "Claim Approved Successfully ✅"
// );



// setRemarks(prev=>{

// const copy={...prev};

// delete copy[claimId];

// return copy;

// });



// setSelectedClaim(null);



// fetchClaims();



// }
// catch(error){


// toast.error(

// error?.response?.data?.message
// ||
// "Approve Failed ❌"

// );


// }
// finally{

// setActionLoading(null);

// }



// };






// // ================= REJECT =================



// const handleReject =
// async(claimId)=>{


// if(
// !remarks[claimId]
// ||
// !remarks[claimId].trim()
// ){

// toast.warning(
// "Please Enter Admin Remark"
// );

// return;

// }



// try{


// setActionLoading(claimId);



// await adminRejectClaim(

// claimId,

// remarks[claimId]

// );



// toast.success(
// "Claim Rejected Successfully ❌"
// );



// setRemarks(prev=>{

// const copy={...prev};

// delete copy[claimId];

// return copy;

// });



// setSelectedClaim(null);



// fetchClaims();



// }
// catch(error){


// toast.error(

// error?.response?.data?.message
// ||
// "Reject Failed ❌"

// );


// }
// finally{

// setActionLoading(null);

// }


// };






// // ================= MODAL =================



// const handleOpenDetails =
// async(claim)=>{


// setSelectedClaim(claim);

// setModalDocs([]);

// setModalPolicy(null);



// try{


// setModalLoading(true);



// const [
// documents,
// policy

// ]=
// await Promise.all([

// getClaimDocument(
// claim.claimId
// ),

// getPolicyByPolicyId(
// claim.policyId
// )

// ]);



// setModalDocs(
// documents || []
// );



// setModalPolicy(
// policy
// );



// }
// catch(error){

// console.log(error);

// }
// finally{

// setModalLoading(false);

// }



// };






// // ================= FILTER =================


// const filteredClaims =
// useMemo(()=>{


// return claims.filter((claim)=>{


// const search =
// searchQuery.toLowerCase();



// const matchSearch =

// claim.claimNumber
// ?.toLowerCase()
// .includes(search)

// ||

// claim.claimReason
// ?.toLowerCase()
// .includes(search)

// ||

// String(claim.claimId)
// .includes(search);



// const matchStatus =

// selectedStatus==="all"

// ?

// true

// :

// claim.claimStatus===selectedStatus;



// return matchSearch && matchStatus;



// });



// },[
// claims,
// searchQuery,
// selectedStatus
// ]);

// return (

// <div className="space-y-6 text-slate-700 dark:text-slate-200">


// {/* HEADER */}

// <div>

// <h1 className="
// text-2xl
// font-black
// text-slate-900
// dark:text-white
// ">

// Claims Manager

// </h1>


// <p className="
// text-xs
// text-slate-500
// mt-1
// ">

// Review, audit and approve/reject submitted claims.

// </p>

// </div>





// {/* SEARCH + FILTER */}


// <div className="
// grid
// grid-cols-1
// md:grid-cols-2
// gap-4
// ">


// <div className="relative">


// <Search

// size={18}

// className="
// absolute
// left-3
// top-3
// text-slate-400
// "

// />



// <input

// type="text"

// placeholder="
// Search claim number, reason or id...
// "

// value={searchQuery}

// onChange={(e)=>
// setSearchQuery(e.target.value)
// }


// className="
// w-full
// pl-10
// pr-4
// py-2.5
// rounded-xl
// border
// bg-white
// dark:bg-slate-900
// border-slate-200
// dark:border-slate-800
// outline-none
// "

// />


// </div>





// <select


// value={selectedStatus}


// onChange={(e)=>
// setSelectedStatus(e.target.value)
// }


// className="
// rounded-xl
// px-4
// py-2.5
// border
// bg-white
// dark:bg-slate-900
// "


// >


// <option value="all">
// All Status
// </option>


// <option value="RECOMMENDED_FOR_APPROVAL">
// RECOMMENDED_FOR_APPROVAL
// </option>


// <option value="RECOMMENDED_FOR_REJECTION">
// RECOMMENDED_FOR_REJECTION
// </option>


// <option value="APPROVED">
// APPROVED
// </option>


// <option value="REJECTED">
// REJECTED
// </option>


// </select>


// </div>








// {/* CLAIM LIST */}



// <div className="space-y-5">


// {

// filteredClaims.map((claim)=>(


// <motion.div

// key={claim.claimId}

// layout

// className="
// bg-white
// dark:bg-slate-900
// border
// border-slate-200
// dark:border-slate-800
// rounded-2xl
// p-6
// shadow-sm
// "


// >



// <div className="
// grid
// grid-cols-1
// md:grid-cols-4
// gap-6
// ">





// {/* CLAIM INFO */}


// <div>


// <p className="
// text-xs
// text-slate-400
// uppercase
// ">

// Claim Details

// </p>



// <p className="font-bold mt-2">

// ID :

// <span className="text-slate-500">

// #{claim.claimId}

// </span>

// </p>



// <p className="text-sm mt-1">

// {claim.claimNumber}

// </p>



// </div>






// {/* AMOUNT */}



// <div>


// <p className="
// text-xs
// text-slate-400
// uppercase
// ">

// Claim Amount

// </p>



// <p className="
// font-black
// text-emerald-600
// mt-2
// ">

// ₹{claim.claimAmount}

// </p>



// <p className="text-xs mt-2">

// {claim.claimReason}

// </p>


// </div>






// {/* AGENT */}



// <div>


// <p className="
// text-xs
// text-slate-400
// uppercase
// ">

// Agent Recommendation

// </p>



// <p className="font-bold mt-2">


// {
// claim.agentInfo?.name
// ||
// "N/A"
// }


// </p>


// <p className="text-xs">


// {
// claim.agentInfo?.status
// ||
// ""
// }


// </p>


// </div>






// {/* STATUS */}



// <div>


// <p className="
// text-xs
// text-slate-400
// uppercase
// ">

// Current Status

// </p>



// <span className="
// inline-flex
// items-center
// gap-2
// mt-2
// px-3
// py-1
// rounded-lg
// bg-slate-100
// dark:bg-slate-800
// text-xs
// font-bold
// ">


// {


// claim.claimStatus==="APPROVED"

// &&

// <CheckCircle size={14}/>


// }



// {


// claim.claimStatus==="REJECTED"

// &&

// <XCircle size={14}/>


// }



// {


// claim.claimStatus?.startsWith(
// "RECOMMENDED"
// )

// &&

// <AlertCircle size={14}/>


// }



// {


// ![
// "APPROVED",
// "REJECTED"

// ].includes(claim.claimStatus)

// &&

// <Clock size={14}/>


// }



// {claim.claimStatus}



// </span>


// </div>



// </div>








// {/* ================= ADMIN ACTION PANEL ================= */}



// {

// role==="ADMIN"

// &&

// (

// claim.claimStatus ===
// "RECOMMENDED_FOR_APPROVAL"

// ||

// claim.claimStatus ===
// "RECOMMENDED_FOR_REJECTION"


// )

// &&


// <div className="
// mt-6
// pt-5
// border-t
// space-y-4
// ">


// <label className="
// text-xs
// font-bold
// text-slate-400
// uppercase
// ">

// Admin Remark

// </label>



// <textarea


// rows="3"


// placeholder="
// Enter approval/rejection remark...
// "


// value={
// remarks[claim.claimId] || ""
// }



// onChange={(e)=>

// setRemarks({

// ...remarks,

// [claim.claimId]:
// e.target.value

// })

// }



// className="
// w-full
// rounded-xl
// border
// p-3
// bg-white
// dark:bg-slate-900
// resize-none
// "


// />







// <div className="
// flex
// gap-3
// ">





// {/* APPROVE BUTTON */}



// <button


// disabled={
// actionLoading===claim.claimId
// }


// onClick={()=>

// handleApprove(
// claim.claimId
// )

// }



// className="
// flex
// items-center
// gap-2
// px-5
// py-2.5
// rounded-xl
// bg-emerald-600
// hover:bg-emerald-700
// text-white
// text-xs
// font-bold
// disabled:opacity-50
// "


// >


// <CheckCircle size={15}/>


// {

// actionLoading===claim.claimId

// ?

// "Processing..."

// :

// "Approve Claim"


// }



// </button>








// {/* REJECT BUTTON */}



// <button


// disabled={
// actionLoading===claim.claimId
// }



// onClick={()=>

// handleReject(
// claim.claimId
// )

// }



// className="
// flex
// items-center
// gap-2
// px-5
// py-2.5
// rounded-xl
// bg-rose-600
// hover:bg-rose-700
// text-white
// text-xs
// font-bold
// disabled:opacity-50
// "


// >


// <XCircle size={15}/>



// {

// actionLoading===claim.claimId

// ?

// "Processing..."

// :

// "Reject Claim"


// }


// </button>



// </div>



// </div>


// }








// {/* VIEW DETAILS */}



// <button


// onClick={()=>

// handleOpenDetails(
// claim
// )

// }


// className="
// mt-5
// flex
// items-center
// gap-2
// px-4
// py-2
// rounded-xl
// bg-blue-50
// text-blue-600
// text-xs
// font-bold
// "


// >


// <Info size={15}/>

// View Details


// </button>





// </motion.div>


// ))


// }


// </div>







// {/* PAGINATION */}



// {

// totalPages > 1 &&


// <div className="
// flex
// justify-between
// items-center
// border-t
// pt-4
// ">


// <button


// disabled={
// currentPage===0
// }



// onClick={()=>

// setCurrentPage(
// p=>p-1
// )

// }


// className="
// p-2
// rounded-lg
// border
// disabled:opacity-40
// "


// >


// <ChevronLeft size={18}/>


// </button>





// <span className="text-sm font-bold">


// {
// currentPage+1
// }

// /

// {
// totalPages
// }


// </span>





// <button


// disabled={
// currentPage===totalPages-1
// }



// onClick={()=>

// setCurrentPage(
// p=>p+1
// )

// }



// className="
// p-2
// rounded-lg
// border
// disabled:opacity-40
// "


// >


// <ChevronRight size={18}/>


// </button>




// </div>



// }
// {/* ================= CLAIM DETAILS MODAL ================= */}


// <AnimatePresence>


// {

// selectedClaim &&


// <motion.div

// initial={{
// opacity:0
// }}

// animate={{
// opacity:1
// }}

// exit={{
// opacity:0
// }}

// className="
// fixed
// inset-0
// z-50
// bg-black/50
// flex
// items-center
// justify-center
// p-5
// "


// >



// <motion.div

// initial={{
// scale:0.9
// }}

// animate={{
// scale:1
// }}

// className="
// w-full
// max-w-4xl
// max-h-[90vh]
// overflow-y-auto
// bg-white
// dark:bg-slate-900
// rounded-3xl
// p-6
// shadow-xl
// "


// >




// {/* CLOSE BUTTON */}


// <button


// onClick={()=>

// setSelectedClaim(null)

// }


// className="
// float-right
// p-2
// rounded-full
// hover:bg-slate-100
// dark:hover:bg-slate-800
// "


// >


// <X size={20}/>


// </button>





// <h2 className="
// text-xl
// font-black
// mb-6
// ">


// Claim Details


// </h2>







// {/* BASIC DETAILS */}



// <div className="
// grid
// grid-cols-1
// md:grid-cols-2
// gap-5
// ">



// <div className="
// border
// rounded-xl
// p-4
// ">


// <p className="text-xs text-slate-400">
// Claim Number
// </p>


// <p className="font-bold">

// {selectedClaim.claimNumber}

// </p>



// <p className="text-xs text-slate-400 mt-3">
// Claim Amount
// </p>


// <p className="font-bold text-emerald-600">

// ₹{selectedClaim.claimAmount}

// </p>



// <p className="text-xs text-slate-400 mt-3">
// Reason
// </p>


// <p>

// {selectedClaim.claimReason}

// </p>



// </div>







// <div className="
// border
// rounded-xl
// p-4
// ">


// <p className="text-xs text-slate-400">
// Status
// </p>



// <p className="
// font-bold
// mt-1
// ">

// {selectedClaim.claimStatus}

// </p>




// <p className="text-xs text-slate-400 mt-3">
// Customer
// </p>



// <p className="font-bold">

// {
// selectedClaim.customerName
// ||
// "N/A"
// }

// </p>




// <p className="text-xs text-slate-400 mt-3">
// Policy Id
// </p>



// <p>

// {
// selectedClaim.policyId
// }

// </p>


// </div>




// </div>







// {/* POLICY DETAILS */}



// <div className="
// mt-6
// border
// rounded-xl
// p-5
// ">


// <h3 className="
// font-black
// flex
// items-center
// gap-2
// ">


// <Shield size={18}/>

// Policy Details


// </h3>



// {

// modalLoading

// ?

// <p className="mt-3">
// Loading...
// </p>


// :

// modalPolicy

// ?

// <div className="
// mt-4
// space-y-2
// text-sm
// ">


// <p>

// <b>Policy Name:</b>

// {" "}

// {
// modalPolicy.policyName
// }


// </p>


// <p>

// <b>Premium:</b>

// {" "}

// ₹{
// modalPolicy.premiumAmount
// }


// </p>



// <p>

// <b>Coverage:</b>

// {" "}

// ₹{
// modalPolicy.coverageAmount
// }


// </p>


// </div>


// :

// <p className="text-sm mt-3">
// No policy data found
// </p>


// }



// </div>









// {/* DOCUMENT SECTION */}



// <div className="
// mt-6
// border
// rounded-xl
// p-5
// ">



// <h3 className="
// font-black
// flex
// items-center
// gap-2
// ">


// <FileText size={18}/>

// Claim Documents


// </h3>





// {

// modalDocs.length > 0

// ?


// <div className="
// mt-4
// space-y-3
// ">




// {

// modalDocs.map((doc)=>(


// <div

// key={doc.documentId}

// className="
// flex
// justify-between
// items-center
// border
// rounded-xl
// p-3
// "


// >


// <div>


// <p className="
// font-bold
// text-sm
// ">

// {
// doc.documentName
// ||
// doc.originalFileName
// }


// </p>


// </div>





// <a

// href={doc.cloudinaryUrl}

// target="_blank"

// rel="noreferrer"

// className="
// flex
// items-center
// gap-2
// text-blue-600
// text-xs
// font-bold
// "


// >


// <Download size={15}/>

// Download


// </a>




// </div>



// ))


// }



// </div>


// :


// <p className="
// text-sm
// text-slate-500
// mt-3
// ">

// No documents available

// </p>



// }




// </div>








// {/* CLAIM HISTORY */}



// <div className="
// mt-6
// border
// rounded-xl
// p-5
// ">



// <h3 className="
// font-black
// flex
// items-center
// gap-2
// ">


// <Clock size={18}/>

// Claim History


// </h3>






// {

// selectedClaim.claimHistory?.length > 0


// ?


// <div className="
// mt-4
// space-y-3
// ">


// {

// selectedClaim.claimHistory.map(
// (history,index)=>(



// <div

// key={index}

// className="
// border-l-4
// border-blue-500
// pl-4
// "


// >


// <p className="
// font-bold
// text-sm
// ">

// {
// history.newStatus
// }

// </p>



// <p className="
// text-xs
// text-slate-500
// ">

// Updated By :

// {
// history.updatedBy
// }


// </p>



// <p className="
// text-xs
// text-slate-400
// ">

// {
// history.updatedDate
// }

// </p>



// </div>


// )

// )



// }



// </div>



// :


// <p className="text-sm mt-3">
// No history found
// </p>



// }



// </div>








// </motion.div>



// </motion.div>


// }


// </AnimatePresence>






// </div>


// );



// };


// export default ViewAllClaimADMIN;