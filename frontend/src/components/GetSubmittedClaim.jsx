import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AgentClaimReview from "./AgentClaimReview";

const GetSubmittedClaim = ({
    onClose,
    submitClaimData,
    loading,
    refreshClaims,
    setShowReviewModal,
    setSelectedClaimId
}) => {

    if (loading) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xl">

                <div className="w-[90%] max-w-6xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-8 shadow-2xl transition-colors duration-300">

                    <div className="space-y-4">

                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-16 rounded-xl bg-slate-100 dark:bg-white/10 animate-pulse"
                            />
                        ))}

                    </div>

                </div>

            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-xl p-6">
                <div
                    className="
                        w-full
                        max-w-7xl
                        max-h-[90vh]
                        overflow-hidden
                        rounded-[32px]
                        border
                        border-slate-200 dark:border-white/10
                        bg-white dark:bg-slate-900/90
                        backdrop-blur-3xl
                        shadow-2xl
                        text-slate-800 dark:text-white
                        transition-all duration-300
                    "
                >
                    {/* HEADER */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            p-6
                            border-b
                            border-slate-200 dark:border-white/10
                        "
                    >
                        <div>

                            <h2
                                className="
                                    text-3xl
                                    font-bold
                                    bg-gradient-to-r
                                    from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400
                                    bg-clip-text
                                    text-transparent
                                "
                            >
                                Submitted Claims
                            </h2>

                            <p className="text-slate-550 dark:text-slate-400 mt-1">
                                Review all submitted insurance claims
                            </p>

                        </div>

                        <button
                            onClick={onClose}
                            className="
                                w-11
                                h-11
                                rounded-full
                                bg-gradient-to-r
                                from-red-500
                                to-rose-500
                                text-white
                                font-bold
                                transition
                                hover:scale-105
                                active:scale-95
                                cursor-pointer
                                flex items-center justify-center
                            "
                        >
                            ✕
                        </button>
                    </div>

                    {/* TABLE */}

                    <div className="overflow-auto max-h-[70vh]">

                        {submitClaimData.length > 0 ? (

                            <table className="w-full">

                                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 z-10">

                                    <tr className="border-b border-slate-200 dark:border-white/10">

                                        <th className="p-4 text-slate-600 dark:text-slate-300 text-sm uppercase">
                                            Claim Number
                                        </th>

                                        <th className="p-4 text-slate-600 dark:text-slate-300 text-sm uppercase">
                                            Claim ID
                                        </th>

                                        <th className="p-4 text-slate-600 dark:text-slate-300 text-sm uppercase">
                                            Amount
                                        </th>

                                        <th className="p-4 text-slate-600 dark:text-slate-300 text-sm uppercase">
                                            Status
                                        </th>

                                        <th className="p-4 text-slate-600 dark:text-slate-300 text-sm uppercase">
                                            Reason
                                        </th>

                                        <th className="p-4 text-slate-600 dark:text-slate-300 text-sm uppercase">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {submitClaimData.map((claim) => (

                                        <tr
                                            key={claim.claimId}
                                            className="
                                                border-b
                                                border-slate-150 dark:border-white/5
                                                hover:bg-slate-50 dark:hover:bg-white/5
                                                transition
                                            "
                                        >
                                            <td className="p-4 text-center text-slate-805 dark:text-white">
                                                {claim.claimNumber}
                                            </td>

                                            <td className="p-4 text-center text-slate-805 dark:text-white">
                                                {claim.claimId}
                                            </td>

                                            <td className="p-4 text-center text-slate-850 dark:text-white">
                                                ₹{claim.claimAmount}
                                            </td>

                                            <td className="p-4 text-center">

                                                <span
                                                    className={`
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-xs
                                                        font-semibold

                                                        ${claim.claimStatus === "SUBMITTED"
                                                            ? "bg-yellow-500/10 text-yellow-605 dark:bg-yellow-500/20 dark:text-yellow-400"
                                                            : claim.claimStatus === "APPROVED"
                                                                ? "bg-green-500/10 text-green-650 dark:bg-green-500/20 dark:text-green-400"
                                                                : "bg-red-500/10 text-red-650 dark:bg-red-500/20 dark:text-red-400"
                                                        }
                                                    `}
                                                >
                                                    {claim.claimStatus}
                                                </span>

                                            </td>

                                            <td className="p-4 text-center text-slate-600 dark:text-slate-300">
                                                {claim.claimReason}
                                            </td>

                                            <td className="p-4 text-center">

                                                <button
                                                    onClick={() => {
                                                        setSelectedClaimId(claim.claimId);
                                                        setShowReviewModal(true);
                                                        onClose();
                                                    }}
                                                    className="
                                                        px-4
                                                        py-2
                                                        rounded-xl
                                                        text-white
                                                        font-semibold
                                                        bg-gradient-to-r
                                                        from-cyan-500
                                                        to-blue-600
                                                        hover:scale-105
                                                        transition
                                                        cursor-pointer
                                                    "
                                                >
                                                    Review Claim
                                                </button>

                                            </td>
                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        ) : (

                            <div className="p-16 text-center">

                                <h2 className="text-2xl text-slate-800 dark:text-white font-bold mb-3">
                                    No Submitted Claims
                                </h2>

                                <p className="text-slate-500 dark:text-slate-400">
                                    There are currently no submitted claims available.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

            {/* NESTED REVIEW MODAL */}

        </>
    );
};

export default GetSubmittedClaim;