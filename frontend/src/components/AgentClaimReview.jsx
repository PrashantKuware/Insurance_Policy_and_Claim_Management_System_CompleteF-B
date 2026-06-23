import React, { useEffect, useState } from 'react';
import {
    agentClaimReview,
    agentRecommendClaimForApproval,
    agentRecommendClaimForRejection,
    getClaimDocument
} from '../services/claimService';

import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AgentClaimReview = () => {

    const { claimId } = useParams();
    const navigate = useNavigate();

    const [claimData, setClaimData] = useState({});
    const [claimDocuData, setClaimDocuData] = useState([]);

    const [agentRemark, setAgentRemark] = useState('');

    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const agentUnderReviewClaim = async () => {
        try {

            const data = await agentClaimReview(claimId);

            setClaimData(data);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                'Failed To Load Claim Details ❌'
            );
        }
    };

    const getDocuData = async () => {
        try {

            const data = await getClaimDocument(claimId);

            setClaimDocuData(data);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                'Failed To Load Documents ❌'
            );
        }
    };

    const RecommendClaimForApproval = async () => {

        if (!agentRemark.trim()) {
            toast.warning('Please Enter Agent Remark');
            return;
        }

        try {

            setActionLoading(true);

            const data =
                await agentRecommendClaimForApproval(
                    claimId,
                    agentRemark
                );

            setClaimData(data);

            toast.success(
                'Claim Recommended For Approval Successfully ✅'
            );

            setTimeout(() => {
                navigate('/agentdashboard');
            }, 1000);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                'Failed To Recommend Claim ❌'
            );

        } finally {

            setActionLoading(false);

        }
    };

    const RecommendClaimForRejection = async () => {

        if (!agentRemark.trim()) {
            toast.warning('Please Enter Agent Remark');
            return;
        }

        try {

            setActionLoading(true);

            const data =
                await agentRecommendClaimForRejection(
                    claimId,
                    agentRemark
                );

            setClaimData(data);

            toast.success(
                'Claim Recommended For Rejection Successfully ✅'
            );

            setTimeout(() => {
                navigate('/agentdashboard');
            }, 1000);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                'Failed To Reject Claim ❌'
            );

        } finally {

            setActionLoading(false);

        }
    };

    useEffect(() => {

        const loadData = async () => {

            try {

                setPageLoading(true);

                await Promise.all([
                    agentUnderReviewClaim(),
                    getDocuData()
                ]);

            } finally {

                setPageLoading(false);

            }
        };

        loadData();

    }, [claimId]);

    if (pageLoading) {
        return (
            <div className="p-6 animate-pulse">

                <div className="border rounded-lg p-4 mb-6 shadow">
                    <div className="h-8 bg-gray-200 rounded w-56 mb-4"></div>

                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-64"></div>
                        <div className="h-4 bg-gray-200 rounded w-56"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-72"></div>
                    </div>
                </div>

                <div className="border rounded-lg p-4 shadow">
                    <div className="h-8 bg-gray-200 rounded w-40 mb-4"></div>

                    <div className="space-y-4">
                        <div className="h-24 bg-gray-200 rounded"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="p-6">

            <div className="border rounded-lg p-4 mb-6 shadow">

                <h2 className="text-2xl font-bold mb-4">
                    Claim Details
                </h2>

                <div className="space-y-2">

                    <p>
                        <strong>Claim Number:</strong>{' '}
                        {claimData.claimNumber}
                    </p>

                    <p>
                        <strong>Claim Amount:</strong>{' '}
                        ₹{claimData.claimAmount}
                    </p>

                    <p>
                        <strong>Claim ID:</strong>{' '}
                        {claimData.claimId}
                    </p>

                    <p>
                        <strong>Reason:</strong>{' '}
                        {claimData.claimReason}
                    </p>

                    <p>
                        <strong>Status:</strong>{' '}
                        {claimData.claimStatus}
                    </p>

                </div>

            </div>

            <div className="mb-6">

                <h2 className="text-2xl font-bold mb-4">
                    Documents
                </h2>

                {
                    claimDocuData.length > 0 ? (

                        claimDocuData.map((doc) => (

                            <div
                                key={doc.documentId}
                                className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
                            >

                                <p>
                                    <strong>Document ID:</strong>{' '}
                                    {doc.documentId}
                                </p>

                                <p>
                                    <strong>File Name:</strong>{' '}
                                    {doc.originalFileName}
                                </p>

                                <p>
                                    <strong>Type:</strong>{' '}
                                    {doc.contentType}
                                </p>

                                <p>
                                    <strong>Size:</strong>{' '}
                                    {doc.sizeInBytes} bytes
                                </p>

                                <p>
                                    <strong>Uploaded:</strong>{' '}
                                    {doc.uploadedAt}
                                </p>

                                {
                                    doc.resourceType === 'image' && (
                                        <img
                                            src={doc.cloudinaryUrl}
                                            alt={doc.originalFileName}
                                            className="w-72 mt-4 rounded border"
                                        />
                                    )
                                }

                                <a
                                    href={doc.cloudinaryUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline block mt-3"
                                >
                                    View Full Document
                                </a>

                            </div>

                        ))

                    ) : (

                        <p className="text-gray-500">
                            No Documents Found
                        </p>

                    )
                }

            </div>

            <div className="border rounded-lg p-4 shadow">

                <h2 className="text-xl font-bold mb-4">
                    Agent Remark
                </h2>

                <textarea
                    rows="4"
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Agent Remark"
                    value={agentRemark}
                    onChange={(e) =>
                        setAgentRemark(e.target.value)
                    }
                />

                <div className="flex gap-4 mt-4">

                    <button
                        disabled={actionLoading}
                        onClick={RecommendClaimForApproval}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg min-w-55 flex justify-center items-center disabled:opacity-50"
                    >
                        {
                            actionLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Recommend For Approval'
                            )
                        }
                    </button>

                    <button
                        disabled={actionLoading}
                        onClick={RecommendClaimForRejection}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg min-w-55 flex justify-center items-center disabled:opacity-50"
                    >
                        {
                            actionLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Recommend For Rejection'
                            )
                        }
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AgentClaimReview;