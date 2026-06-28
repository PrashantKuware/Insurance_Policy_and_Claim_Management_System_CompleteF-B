import React, { useEffect, useState } from 'react';
import {
    getAllClaims,
    adminApproveClaim,
    adminRejectClaim
} from '../services/claimService';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ViewAllClaimADMIN = () => {

    const [claims, setClaims] = useState([]);
    const [remarks, setRemarks] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedClaim, setSelectedClaim] = useState(null);

    const handleDetails = (claim) => {
        setSelectedClaim(claim);
    };

    const fetchClaims = async () => {

        try {

            setLoading(true);

            const data = await getAllClaims();

            console.log(data);

            setClaims(data?.content || []);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Claims ❌"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const handleApprove = async (claimId) => {

        if (
            !remarks[claimId] ||
            !remarks[claimId].trim()
        ) {
            toast.warning(
                "Please Enter Admin Remark"
            );
            return;
        }

        try {

            setActionLoading(claimId);

            await adminApproveClaim(
                claimId,
                remarks[claimId]
            );

            toast.success(
                "Claim Approved Successfully ✅"
            );

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

        if (
            !remarks[claimId] ||
            !remarks[claimId].trim()
        ) {
            toast.warning(
                "Please Enter Admin Remark"
            );
            return;
        }

        try {

            setActionLoading(claimId);

            await adminRejectClaim(
                claimId,
                remarks[claimId]
            );

            toast.success(
                "Claim Rejected Successfully ❌"
            );

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

    if (loading) {

        return (
            <div className="p-6 space-y-4">

                {Array.from({ length: 5 }).map((_, index) => (

                    <div
                        key={index}
                        className="bg-white border rounded-xl p-5 animate-pulse"
                    >

                        <div className="h-5 w-40 bg-gray-300 rounded mb-3"></div>

                        <div className="h-5 w-52 bg-gray-300 rounded mb-3"></div>

                        <div className="h-5 w-32 bg-gray-300 rounded mb-3"></div>

                        <div className="h-5 w-64 bg-gray-300 rounded mb-3"></div>

                        <div className="h-5 w-28 bg-gray-300 rounded"></div>

                    </div>

                ))}

            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ">
            <div className="w-72 fixed h-full">
                <Sidebar />
            </div>
            <div className="flex-1 ml-72">
                <Navbar />

                <div className="p-8">

                    <h1 className="text-3xl font-bold mb-6">
                        All Claims
                    </h1>

                    {
                        claims.length > 0 ? (
                            <>
                            <div className="space-y-6">

                                {
                                    claims.map((claim) => (

                                        <div
                                            key={claim.claimId}
                                            className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-all"
                                        >

                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                                                <div>

                                                    <p className="text-gray-500 text-sm">
                                                        Claim ID
                                                    </p>

                                                    <p className="font-semibold">
                                                        {claim.claimId}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-gray-500 text-sm">
                                                        Claim Number
                                                    </p>

                                                    <p className="font-semibold">
                                                        {claim.claimNumber}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-gray-500 text-sm">
                                                        Claim Amount
                                                    </p>

                                                    <p className="font-semibold text-green-600">
                                                        ₹{claim.claimAmount}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-gray-500 text-sm">
                                                        Claim Reason
                                                    </p>

                                                    <p className="font-semibold">
                                                        {claim.claimReason}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-gray-500 text-sm">
                                                        Status
                                                    </p>

                                                    <p
                                                        className={`font-semibold ${claim.claimStatus === "APPROVED"
                                                            ? "text-green-600"
                                                            : claim.claimStatus === "REJECTED"
                                                                ? "text-red-600"
                                                                : claim.claimStatus === "RECOMMENDED_FOR_APPROVAL"
                                                                    ? "text-blue-600"
                                                                    : claim.claimStatus === "RECOMMENDED_FOR_REJECTION"
                                                                        ? "text-orange-600"
                                                                        : "text-yellow-600"
                                                            }`}
                                                    >
                                                        {claim.claimStatus}
                                                    </p>

                                                </div>

                                            </div>
                                            <div className="mt-5 flex justify-between items-center">

                                                <button
                                                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                                                    onClick={() => handleDetails(claim)}
                                                >
                                                    Details
                                                </button>

                                            </div>

                                            {(claim.claimStatus ===
                                                "RECOMMENDED_FOR_APPROVAL" ||
                                                claim.claimStatus ===
                                                "RECOMMENDED_FOR_REJECTION") && (

                                                    <div className="mt-5">

                                                        <textarea
                                                            rows="4"
                                                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Enter Admin Remark"
                                                            value={
                                                                remarks[claim.claimId] || ""
                                                            }
                                                            onChange={(e) =>
                                                                setRemarks({
                                                                    ...remarks,
                                                                    [claim.claimId]:
                                                                        e.target.value
                                                                })
                                                            }
                                                        />

                                                        <div className="mt-4 flex gap-4">

                                                            {
                                                                claim.claimStatus ===
                                                                "RECOMMENDED_FOR_APPROVAL" && (

                                                                    <button
                                                                        disabled={
                                                                            actionLoading === claim.claimId
                                                                        }
                                                                        onClick={() =>
                                                                            handleApprove(
                                                                                claim.claimId
                                                                            )
                                                                        }
                                                                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                                                                    >

                                                                        {
                                                                            actionLoading ===
                                                                                claim.claimId
                                                                                ? "Processing..."
                                                                                : "Approve Claim"
                                                                        }

                                                                    </button>

                                                                )
                                                            }

                                                            {
                                                                claim.claimStatus ===
                                                                "RECOMMENDED_FOR_REJECTION" && (

                                                                    <button
                                                                        disabled={
                                                                            actionLoading === claim.claimId
                                                                        }
                                                                        onClick={() =>
                                                                            handleReject(
                                                                                claim.claimId
                                                                            )
                                                                        }
                                                                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                                                                    >

                                                                        {
                                                                            actionLoading ===
                                                                                claim.claimId
                                                                                ? "Processing..."
                                                                                : "Reject Claim"
                                                                        }

                                                                    </button>

                                                                )
                                                            }

                                                        </div>

                                                    </div>

                                                )}

                                        </div>

                                    ))

                                }

                            </div>
                            {
                                                selectedClaim && (

                                                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

                                                        <div className="bg-white rounded-xl w-[700px] p-8 relative">

                                                            <button
                                                                className="absolute top-4 right-4 text-xl cursor-pointer"
                                                                onClick={() => setSelectedClaim(null)}
                                                            >
                                                                ✕
                                                            </button>

                                                            <h2 className="text-2xl font-bold mb-6">
                                                                Claim Details
                                                            </h2>

                                                            <div className="grid grid-cols-2 gap-4">

                                                                <div>
                                                                    <strong>Claim Number</strong>
                                                                    <p>{selectedClaim.claimNumber}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Status</strong>
                                                                    <p>{selectedClaim.claimStatus}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Amount</strong>
                                                                    <p>₹{selectedClaim.claimAmount}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Reason</strong>
                                                                    <p>{selectedClaim.claimReason}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Agent Name</strong>
                                                                    <p>{selectedClaim.agentName}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Agent Email</strong>
                                                                    <p>{selectedClaim.agentEmail}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Agent Remark</strong>
                                                                    <p>{selectedClaim.agentRemark}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Recommendation</strong>
                                                                    <p>{selectedClaim.agentRecommendation}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Admin Name</strong>
                                                                    <p>{selectedClaim.adminName}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Admin Remark</strong>
                                                                    <p>{selectedClaim.adminRemark}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Approved On</strong>
                                                                    <p>{selectedClaim.approvedDate}</p>
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                )}
                            </>

                        ) : (

                            <div className="text-center py-12">

                                <h2 className="text-2xl font-semibold text-gray-600">
                                    No Claims Found
                                </h2>

                            </div>

                        )
                    }

                </div>
            </div>
        </div>
    );
};

export default ViewAllClaimADMIN;