import React, { useEffect, useState } from 'react';
import {
    getAllClaims,
    adminApproveClaim,
    adminRejectClaim
} from '../services/claimService';
import { toast } from 'react-toastify';

const ViewAllClaimADMIN = () => {

    const [claims, setClaims] = useState([]);
    const [remarks, setRemarks] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

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
        <div className="p-6 text-gray-500">

            <h1 className="text-3xl font-bold mb-6">
                All Claims
            </h1>

            {
                claims.length > 0 ? (

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
                                                className={`font-semibold ${
                                                    claim.claimStatus === "APPROVED"
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

                ) : (

                    <div className="text-center py-12">

                        <h2 className="text-2xl font-semibold text-gray-600">
                            No Claims Found
                        </h2>

                    </div>

                )
            }

        </div>
    );
};

export default ViewAllClaimADMIN;