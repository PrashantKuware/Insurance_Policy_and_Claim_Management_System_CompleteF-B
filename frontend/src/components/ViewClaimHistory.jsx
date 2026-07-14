import React, { useEffect, useState } from "react";
import {
    getClaimHistoryByClaimId,
    getClaimHistoryByPolicyId,
} from "../services/claimHistoryService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const ViewClaimHistory = () => {

    const [claimHistoryData, setClaimHistoryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const { claimId, policyId } = useParams();

    const recordsPerPage = 5;

    const getClaimHistoryByClaim = async () => {
        try {
            const data = await getClaimHistoryByClaimId(claimId);
            setClaimHistoryData(data || []);
        } catch (error) {
            console.error(error);

            toast.error(
                error?.message ||
                "Failed To Load Claim History ❌"
            );
        }
    };

    const getClaimHistoryByPolicy = async () => {
        try {
            const data = await getClaimHistoryByPolicyId(policyId);
            setClaimHistoryData(data || []);
        } catch (error) {
            console.error(error);

            toast.error(
                error?.message ||
                "Failed To Load Claim History ❌"
            );
        }
    };

    useEffect(() => {

        if (claimId) {
            getClaimHistoryByClaim();
        } else if (policyId) {
            getClaimHistoryByPolicy();
        }

    }, [claimId, policyId]);

    // Pagination Logic

    const totalPages = Math.ceil(
        claimHistoryData.length / recordsPerPage
    );

    const indexOfLastRecord =
        currentPage * recordsPerPage;

    const indexOfFirstRecord =
        indexOfLastRecord - recordsPerPage;

    const currentRecords =
        claimHistoryData.slice(
            indexOfFirstRecord,
            indexOfLastRecord
        );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-6 animate-fadeIn">

            <div className="w-full max-w-7xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 shadow-2xl overflow-hidden transition-all duration-300">

                {/* Header */}

                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-white/10">

                    <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-cyan-600 dark:from-white dark:to-cyan-400 bg-clip-text text-transparent">
                        Claim History
                    </h2>

                    <button
                        onClick={() => window.history.back()}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 hover:rotate-90 transition-all duration-300 flex items-center justify-center text-white cursor-pointer"
                    >
                        ✕
                    </button>

                </div>

                {/* Table */}

                <div className="max-h-[70vh] overflow-y-auto">

                    <table className="w-full">

                        <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 transition-colors">

                            <tr>

                                <th className="py-5 px-4 text-slate-600 dark:text-slate-300 uppercase text-sm">
                                    Previous Status
                                </th>

                                <th className="py-5 px-4 text-slate-600 dark:text-slate-300 uppercase text-sm">
                                    New Status
                                </th>

                                <th className="py-5 px-4 text-slate-600 dark:text-slate-300 uppercase text-sm">
                                    Remarks
                                </th>

                                <th className="py-5 px-4 text-slate-600 dark:text-slate-300 uppercase text-sm">
                                    Updated By
                                </th>

                                <th className="py-5 px-4 text-slate-600 dark:text-slate-300 uppercase text-sm">
                                    Updated Date
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {claimHistoryData.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="py-10 text-center text-slate-500 dark:text-slate-300 text-lg"
                                    >
                                        Oops! No Claim History Found 🤨
                                    </td>

                                </tr>

                            ) : (

                                currentRecords.map((item, index) => (

                                    <tr
                                        key={index}
                                        className="border-b border-slate-150 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                                    >

                                        <td className="py-5 px-4 text-center text-slate-805 dark:text-white">
                                            {item.previousStatus || "-"}
                                        </td>

                                        <td className="py-5 px-4 text-center">

                                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-cyan-550/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300">
                                                {item.newStatus}
                                            </span>

                                        </td>

                                        <td className="py-5 px-4 text-center text-slate-805 dark:text-white">
                                            {item.remarks}
                                        </td>

                                        <td className="py-5 px-4 text-center text-slate-805 dark:text-white">
                                            {item.updatedBy || "-"}
                                        </td>

                                        <td className="py-5 px-4 text-center text-slate-805 dark:text-white whitespace-nowrap">
                                            {new Date(
                                                item.updatedDate
                                            ).toLocaleString()}
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

                {/* Pagination */}

                {claimHistoryData.length > recordsPerPage && (

                    <div className="flex justify-center items-center gap-2 py-5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 transition-colors">

                        <button
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(
                                    currentPage - 1
                                )
                            }
                            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white disabled:opacity-40 cursor-pointer"
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map(
                            (_, index) => (

                                <button
                                    key={index}
                                    onClick={() =>
                                        setCurrentPage(
                                            index + 1
                                        )
                                    }
                                    className={`w-10 h-10 rounded-lg font-semibold transition cursor-pointer ${
                                        currentPage ===
                                        index + 1
                                            ? "bg-cyan-600 dark:bg-cyan-500 text-white"
                                            : "bg-slate-200 dark:bg-slate-700 text-slate-605 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                                    }`}
                                >
                                    {index + 1}
                                </button>

                            )
                        )}

                        <button
                            disabled={
                                currentPage === totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    currentPage + 1
                                )
                            }
                            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white disabled:opacity-40 cursor-pointer"
                        >
                            Next
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
};

export default ViewClaimHistory;