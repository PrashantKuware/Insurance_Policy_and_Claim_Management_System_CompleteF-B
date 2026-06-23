import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { getPolicyByPolicyId } from '../services/policyService';
import {
    getClaimByPolicyId,
    getClaimDocument,
    withdrawClaimById
} from '../services/claimService';
import { toast } from 'react-toastify';

const ViewClaim = () => {

    const { policyId } = useParams();

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

            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Policy ❌"
            );
        }
    };

    const getClaimData = async () => {

        try {

            const data = await getClaimByPolicyId(policyId);

            const claim = data?.content?.[0];

            if (claim) {

                setClaimData(claim);
                setClaimId(claim.claimId);

            }

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Claim ❌"
            );
        }
    };

    const getDocuData = async (id) => {

        try {

            const data = await getClaimDocument(id);

            setClaimDocuData(data || []);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Documents ❌"
            );
        }
    };

    const withdrawClaim = async () => {

        try {

            setWithdrawLoading(true);

            const data = await withdrawClaimById(claimId);

            setClaimData(data);

            toast.success(
                "Claim Withdrawn Successfully ✅"
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed To Withdraw Claim ❌"
            );

        } finally {

            setWithdrawLoading(false);

        }
    };

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                getPolicyById(),
                getClaimData()
            ]);

            setLoading(false);
        };

        loadData();

    }, [policyId]);

    useEffect(() => {

        if (claimId) {
            getDocuData(claimId);
        }

    }, [claimId]);

    if (loading) {

        return (
            <div className="p-6 space-y-4">

                <div className="bg-white p-6 rounded-xl shadow animate-pulse">

                    <div className="h-6 bg-gray-300 rounded w-52 mb-4"></div>

                    <div className="space-y-3">

                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            {/* Policy Details */}

            <div className="bg-white rounded-xl shadow-lg p-6">

                <h2 className="text-2xl font-bold mb-4">
                    Policy Details
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                    <p>
                        <strong>Customer:</strong>{" "}
                        {planData.customerName}
                    </p>

                    <p>
                        <strong>Plan:</strong>{" "}
                        {planData.planName}
                    </p>

                    <p>
                        <strong>Policy ID:</strong>{" "}
                        {planData.policyId}
                    </p>

                    <p>
                        <strong>Policy Number:</strong>{" "}
                        {planData.policyNumber}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {planData.policyStatus}
                    </p>

                    <p>
                        <strong>Total Premium:</strong>{" "}
                        ₹{planData.totalPremiumPaid}
                    </p>

                    <p>
                        <strong>Start Date:</strong>{" "}
                        {planData.startDate}
                    </p>

                    <p>
                        <strong>End Date:</strong>{" "}
                        {planData.endDate}
                    </p>

                </div>

                {
                    planData.policyStatus === "ACTIVE" &&
                    !claimData && (
                        <div className="mt-5">

                            <NavLink
                                to={`/policy/submitclaim/${planData.policyId}`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Submit Claim
                            </NavLink>

                        </div>
                    )
                }

            </div>

            {/* Claim Details */}

            {
                claimData ? (

                    <div className="bg-green-50 border border-green-300 rounded-xl p-6 shadow">

                        <h2 className="text-2xl font-bold mb-4">
                            Claim Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">

                            <p>
                                <strong>Claim ID:</strong>{" "}
                                {claimData.claimId}
                            </p>

                            <p>
                                <strong>Claim Number:</strong>{" "}
                                {claimData.claimNumber}
                            </p>

                            <p>
                                <strong>Claim Amount:</strong>{" "}
                                ₹{claimData.claimAmount}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {claimData.claimStatus}
                            </p>

                            <p className="md:col-span-2">
                                <strong>Reason:</strong>{" "}
                                {claimData.claimReason}
                            </p>

                        </div>

                        {
                            claimData.claimStatus === "SUBMITTED" && (

                                <button
                                    onClick={withdrawClaim}
                                    disabled={withdrawLoading}
                                    className="mt-5 bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                                >

                                    {
                                        withdrawLoading
                                            ? "Processing..."
                                            : "Withdraw Claim"
                                    }

                                </button>

                            )
                        }

                    </div>

                ) : (

                    <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6">

                        <h2 className="text-xl font-semibold">
                            Claim Not Submitted Yet
                        </h2>

                    </div>

                )
            }

            {/* Documents */}

            {
                claimDocuData.length > 0 && (

                    <div>

                        <h2 className="text-2xl font-bold mb-4">
                            Uploaded Documents
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">

                            {
                                claimDocuData.map((doc) => (

                                    <div
                                        key={doc.documentId}
                                        className="bg-white border rounded-xl p-4 shadow"
                                    >

                                        <p>
                                            <strong>File:</strong>{" "}
                                            {doc.originalFileName}
                                        </p>

                                        <p>
                                            <strong>Type:</strong>{" "}
                                            {doc.contentType}
                                        </p>

                                        <p>
                                            <strong>Size:</strong>{" "}
                                            {doc.sizeInBytes} bytes
                                        </p>

                                        {
                                            doc.resourceType === "image" && (

                                                <img
                                                    src={doc.cloudinaryUrl}
                                                    alt={doc.originalFileName}
                                                    className="w-full h-56 object-cover rounded mt-3"
                                                />

                                            )
                                        }

                                        <a
                                            href={doc.cloudinaryUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 underline mt-3 block"
                                        >
                                            View Full Document
                                        </a>

                                    </div>

                                ))
                            }

                        </div>

                    </div>

                )
            }

        </div>
    );
};

export default ViewClaim;