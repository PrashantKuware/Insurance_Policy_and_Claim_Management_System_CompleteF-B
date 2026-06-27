// import React, { useEffect, useState } from 'react';
// import {
//     agentClaimReview,
//     agentRecommendClaimForApproval,
//     agentRecommendClaimForRejection,
//     getClaimDocument
// } from '../services/claimService';

// import { useNavigate, useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const AgentClaimReview = () => {

//     const { claimId } = useParams();
//     const navigate = useNavigate();

//     const [claimData, setClaimData] = useState({});
//     const [claimDocuData, setClaimDocuData] = useState([]);

//     const [agentRemark, setAgentRemark] = useState('');

//     const [pageLoading, setPageLoading] = useState(true);
//     const [actionLoading, setActionLoading] = useState(false);

//     const agentUnderReviewClaim = async () => {
//         try {

//             const data = await agentClaimReview(claimId);

//             setClaimData(data);
//             console.log(data)

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 'Failed To Load Claim Details ❌'
//             );
//         }
//     };

//     const getDocuData = async () => {
//         try {

//             const data = await getClaimDocument(claimId);

//             setClaimDocuData(data);

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 'Failed To Load Documents ❌'
//             );
//         }
//     };

//     const RecommendClaimForApproval = async () => {

//         if (!agentRemark.trim()) {
//             toast.warning('Please Enter Agent Remark');
//             return;
//         }

//         try {

//             setActionLoading(true);

//             const data =
//                 await agentRecommendClaimForApproval(
//                     claimId,
//                     agentRemark
//                 );

//             setClaimData(data);

//             toast.success(
//                 'Claim Recommended For Approval Successfully ✅'
//             );

//             setTimeout(() => {
//                 navigate('/agentdashboard');
//             }, 1000);

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 'Failed To Recommend Claim ❌'
//             );

//         } finally {

//             setActionLoading(false);

//         }
//     };

//     const RecommendClaimForRejection = async () => {

//         if (!agentRemark.trim()) {
//             toast.warning('Please Enter Agent Remark');
//             return;
//         }

//         try {

//             setActionLoading(true);

//             const data =
//                 await agentRecommendClaimForRejection(
//                     claimId,
//                     agentRemark
//                 );

//             setClaimData(data);

//             toast.success(
//                 'Claim Recommended For Rejection Successfully ✅'
//             );

//             setTimeout(() => {
//                 navigate('/agentdashboard');
//             }, 1000);

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 'Failed To Reject Claim ❌'
//             );

//         } finally {

//             setActionLoading(false);

//         }
//     };

//     useEffect(() => {

//         const loadData = async () => {

//             try {

//                 setPageLoading(true);

//                 await Promise.all([
//                     agentUnderReviewClaim(),
//                     getDocuData()
//                 ]);

//             } finally {

//                 setPageLoading(false);

//             }
//         };

//         loadData();

//     }, [claimId]);

//     if (pageLoading) {
//         return (
//             <div className="p-6 animate-pulse">

//                 <div className="border rounded-lg p-4 mb-6 shadow">
//                     <div className="h-8 bg-gray-200 rounded w-56 mb-4"></div>

//                     <div className="space-y-3">
//                         <div className="h-4 bg-gray-200 rounded w-64"></div>
//                         <div className="h-4 bg-gray-200 rounded w-56"></div>
//                         <div className="h-4 bg-gray-200 rounded w-48"></div>
//                         <div className="h-4 bg-gray-200 rounded w-72"></div>
//                     </div>
//                 </div>

//                 <div className="border rounded-lg p-4 shadow">
//                     <div className="h-8 bg-gray-200 rounded w-40 mb-4"></div>

//                     <div className="space-y-4">
//                         <div className="h-24 bg-gray-200 rounded"></div>
//                         <div className="h-24 bg-gray-200 rounded"></div>
//                     </div>
//                 </div>

//             </div>
//         );
//     }

//     return (
//         <div className="p-6">

//             <div className="border rounded-lg p-4 mb-6 shadow">

//                 <h2 className="text-2xl font-bold mb-4">
//                     Claim Details
//                 </h2>

//                 <div className="space-y-2">
//                     <p>
//                         <strong>Customer Name:</strong>{" "}
//                         {claimData.customerName}
//                     </p>
//                     <p>
//                         <strong>Customer Name:</strong>{" "}
//                         {claimData.claimStatus}
//                     </p>
//                     <p>
//                         <strong>Customer Number:</strong>{" "}
//                         {claimData.claimNumber}
//                     </p>
//                     <p>
//                         <strong>Customer Reason:</strong>{" "}
//                         {claimData.claimReason}
//                     </p>
//                     <p>
//                         <strong>ClaimId:</strong>{" "}
//                         {claimData.claimId}
//                     </p>

//                     <p>
//                         <strong>Customer Email:</strong>{" "}
//                         {claimData.customerEmail}
//                     </p>

//                     <p>
//                         <strong>Policy ID:</strong>{" "}
//                         {claimData.policyId}
//                     </p>

//                     <p>
//                         <strong>Plan Name:</strong>{" "}
//                         {claimData.planName}
//                     </p>

//                     <p>
//                         <strong>Coverage Amount:</strong>{" "}
//                         ₹{claimData.coverageAmount}
//                     </p>

//                     <p>
//                         <strong>Premium Amount:</strong>{" "}
//                         ₹{claimData.premiumAmount}
//                     </p>

//                     <p>
//                         <strong>Claim Amount:</strong>{" "}
//                         ₹{claimData.claimAmount}
//                     </p>

//                     <p>
//                         <strong>Policy Start Date:</strong>{" "}
//                         {claimData.policyStartDate}
//                     </p>

//                     <p>
//                         <strong>Policy End Date:</strong>{" "}
//                         {claimData.policyEndDate}
//                     </p>

//                 </div>

//             </div>

//             <div className="mb-6">

//                 <h2 className="text-2xl font-bold mb-4">
//                     Documents
//                 </h2>

//                 {
//                     claimDocuData.length > 0 ? (

//                         claimDocuData.map((doc) => (

//                             <div
//                                 key={doc.documentId}
//                                 className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
//                             >

//                                 <p>
//                                     <strong>Document ID:</strong>{' '}
//                                     {doc.documentId}
//                                 </p>

//                                 <p>
//                                     <strong>File Name:</strong>{' '}
//                                     {doc.originalFileName}
//                                 </p>

//                                 <p>
//                                     <strong>Type:</strong>{' '}
//                                     {doc.contentType}
//                                 </p>

//                                 <p>
//                                     <strong>Size:</strong>{' '}
//                                     {doc.sizeInBytes} bytes
//                                 </p>

//                                 <p>
//                                     <strong>Uploaded:</strong>{' '}
//                                     {doc.uploadedAt}
//                                 </p>

//                                 {
//                                     doc.resourceType === 'image' && (
//                                         <img
//                                             src={doc.cloudinaryUrl}
//                                             alt={doc.originalFileName}
//                                             className="w-72 mt-4 rounded border"
//                                         />
//                                     )
//                                 }

//                                 <a
//                                     href={doc.cloudinaryUrl}
//                                     target="_blank"
//                                     rel="noreferrer"
//                                     className="text-blue-600 underline block mt-3"
//                                 >
//                                     View Full Document
//                                 </a>

//                             </div>

//                         ))

//                     ) : (

//                         <p className="text-gray-500">
//                             No Documents Found
//                         </p>

//                     )
//                 }

//             </div>

//             <div className="border rounded-lg p-4 shadow">

//                 <h2 className="text-xl font-bold mb-4">
//                     Agent Remark
//                 </h2>

//                 <textarea
//                     rows="4"
//                     className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
//                     placeholder="Enter Agent Remark"
//                     value={agentRemark}
//                     onChange={(e) =>
//                         setAgentRemark(e.target.value)
//                     }
//                 />

//                 <div className="flex gap-4 mt-4">

//                     <button
//                         disabled={actionLoading}
//                         onClick={RecommendClaimForApproval}
//                         className="px-4 py-2 bg-green-600 text-white rounded-lg min-w-55 flex justify-center items-center disabled:opacity-50"
//                     >
//                         {
//                             actionLoading ? (
//                                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                             ) : (
//                                 'Recommend For Approval'
//                             )
//                         }
//                     </button>

//                     <button
//                         disabled={actionLoading}
//                         onClick={RecommendClaimForRejection}
//                         className="px-4 py-2 bg-red-600 text-white rounded-lg min-w-55 flex justify-center items-center disabled:opacity-50"
//                     >
//                         {
//                             actionLoading ? (
//                                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                             ) : (
//                                 'Recommend For Rejection'
//                             )
//                         }
//                     </button>

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default AgentClaimReview;

import React, { useEffect, useState } from "react";
import {
    agentClaimReview,
    agentRecommendClaimForApproval,
    agentRecommendClaimForRejection,
    getClaimDocument
} from "../services/claimService";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AgentClaimReview = ({
    claimId: modalClaimId,
    isModal = false,
    onClose
}) => {

    const params = useParams();
    const navigate = useNavigate();

    const claimId =
        modalClaimId || params.claimId;

    const [claimData, setClaimData] = useState({});
    const [claimDocuData, setClaimDocuData] = useState([]);

    const [agentRemark, setAgentRemark] =
        useState("");

    const [pageLoading, setPageLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const loadClaimData = async () => {
        try {

            const claim =
                await agentClaimReview(claimId);

            setClaimData(claim);

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Claim ❌"
            );
        }
    };

    const loadDocuments = async () => {
        try {

            const docs =
                await getClaimDocument(claimId);

            setClaimDocuData(docs || []);

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Documents ❌"
            );
        }
    };

    useEffect(() => {

        const loadData = async () => {

            try {

                setPageLoading(true);

                await Promise.all([
                    loadClaimData(),
                    loadDocuments()
                ]);

            } finally {

                setPageLoading(false);
            }
        };

        loadData();

    }, [claimId]);

    const handleApprove = async () => {

        if (!agentRemark.trim()) {

            toast.warning(
                "Please Enter Agent Remark"
            );

            return;
        }

        try {

            setActionLoading(true);

            await agentRecommendClaimForApproval(
                claimId,
                agentRemark
            );

            toast.success(
                "Recommended For Approval ✅"
            );

            if (isModal) {

                onClose?.();

            } else {

                setTimeout(() => {
                    navigate("/agentdashboard");
                }, 1000);

            }

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed To Recommend Claim ❌"
            );

        } finally {

            setActionLoading(false);
        }
    };

    const handleReject = async () => {

        if (!agentRemark.trim()) {

            toast.warning(
                "Please Enter Agent Remark"
            );

            return;
        }

        try {

            setActionLoading(true);

            await agentRecommendClaimForRejection(
                claimId,
                agentRemark
            );

            toast.success(
                "Recommended For Rejection ❌"
            );

            if (isModal) {

                onClose?.();

            } else {

                setTimeout(() => {
                    navigate("/agentdashboard");
                }, 1000);

            }

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed To Reject Claim ❌"
            );

        } finally {

            setActionLoading(false);
        }
    };

    if (pageLoading) {

        return (
            <div className="flex justify-center items-center min-h-[400px]">

                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />

            </div>
        );
    }

    const content = (
        <div className="space-y-6">

            {/* CLAIM DETAILS */}

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">

                <h2 className="text-2xl font-bold text-white mb-5">
                    Claim Details
                </h2>

                <div className="grid md:grid-cols-2 gap-4 text-slate-300">

                    <p>
                        <strong>Customer:</strong>{" "}
                        {claimData.customerName}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {claimData.customerEmail}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {claimData.claimStatus}
                    </p>

                    <p>
                        <strong>Claim Number:</strong>{" "}
                        {claimData.claimNumber}
                    </p>

                    <p>
                        <strong>Claim ID:</strong>{" "}
                        {claimData.claimId}
                    </p>

                    <p>
                        <strong>Policy ID:</strong>{" "}
                        {claimData.policyId}
                    </p>

                    <p>
                        <strong>Plan:</strong>{" "}
                        {claimData.planName}
                    </p>

                    <p>
                        <strong>Coverage:</strong>{" "}
                        ₹{claimData.coverageAmount}
                    </p>

                    <p>
                        <strong>Premium:</strong>{" "}
                        ₹{claimData.premiumAmount}
                    </p>

                    <p>
                        <strong>Claim Amount:</strong>{" "}
                        ₹{claimData.claimAmount}
                    </p>

                    <p>
                        <strong>Start:</strong>{" "}
                        {claimData.policyStartDate}
                    </p>

                    <p>
                        <strong>End:</strong>{" "}
                        {claimData.policyEndDate}
                    </p>

                </div>

                <div className="mt-5">

                    <strong className="text-white">
                        Claim Reason:
                    </strong>

                    <p className="text-slate-300 mt-2">
                        {claimData.claimReason}
                    </p>

                </div>

            </div>

            {/* DOCUMENTS */}

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">

                <h2 className="text-2xl font-bold text-white mb-5">
                    Documents
                </h2>

                {claimDocuData.length > 0 ? (

                    <div className="grid md:grid-cols-2 gap-5">

                        {claimDocuData.map((doc) => (

                            <div
                                key={doc.documentId}
                                className="rounded-2xl border border-white/10 p-4"
                            >

                                <p className="text-slate-300">
                                    <strong>ID:</strong>{" "}
                                    {doc.documentId}
                                </p>

                                <p className="text-slate-300">
                                    <strong>Name:</strong>{" "}
                                    {doc.originalFileName}
                                </p>

                                <p className="text-slate-300">
                                    <strong>Type:</strong>{" "}
                                    {doc.contentType}
                                </p>

                                {doc.resourceType ===
                                    "image" && (
                                    <img
                                        src={doc.cloudinaryUrl}
                                        alt=""
                                        className="w-full h-52 object-cover rounded-xl mt-4"
                                    />
                                )}

                                <a
                                    href={doc.cloudinaryUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-4 text-cyan-400 hover:text-cyan-300"
                                >
                                    View Document
                                </a>

                            </div>
                        ))}

                    </div>

                ) : (

                    <p className="text-slate-400">
                        No Documents Found
                    </p>

                )}

            </div>

            {/* REMARK */}

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">

                <h2 className="text-xl font-bold text-white mb-4">
                    Agent Remark
                </h2>

                <textarea
                    rows="5"
                    value={agentRemark}
                    onChange={(e) =>
                        setAgentRemark(
                            e.target.value
                        )
                    }
                    className="
                        w-full
                        rounded-2xl
                        bg-slate-800
                        border
                        border-white/10
                        p-4
                        text-white
                        outline-none
                    "
                    placeholder="Enter remark..."
                />

                <div className="flex flex-wrap gap-4 mt-6">

                    <button
                        disabled={actionLoading}
                        onClick={handleApprove}
                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-green-600
                            text-white
                            font-semibold
                        "
                    >
                        Recommend Approval
                    </button>

                    <button
                        disabled={actionLoading}
                        onClick={handleReject}
                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-red-600
                            text-white
                            font-semibold
                        "
                    >
                        Recommend Rejection
                    </button>

                </div>

            </div>

        </div>
    );

    if (!isModal) {

        return (
            <div className="min-h-screen bg-slate-950 p-6">
                {content}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6">

            <div
                className="
                    w-full
                    max-w-7xl
                    max-h-[90vh]
                    overflow-y-auto
                    rounded-[32px]
                    border
                    border-white/10
                    bg-slate-900
                    p-6
                "
            >
                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-3xl font-bold text-white">
                        Claim Review
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            w-11
                            h-11
                            rounded-full
                            bg-red-500
                            text-white
                        "
                    >
                        ✕
                    </button>

                </div>

                {content}

            </div>

        </div>
    );
};

export default AgentClaimReview;