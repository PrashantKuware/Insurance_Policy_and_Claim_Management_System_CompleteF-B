// import React, { useEffect, useState } from 'react';
// import { getSubmittedClaim } from '../services/claimService';
// import { NavLink } from 'react-router-dom';
// import { toast } from 'react-toastify';

// // const GetSubmittedClaim = () => {

// //     const [submitClaimData, setSubmitClaimData] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     const getSubmitClaim = async () => {

// //         try {

// //             setLoading(true);

// //             const data = await getSubmittedClaim();

// //             setSubmitClaimData(data || []);

// //             console.log(data);

// //         } catch (error) {

// //             console.error(error);

// //             toast.error(
// //                 error?.response?.data?.message ||
// //                 "Failed To Load Claims ❌"
// //             );

// //         } finally {

// //             setLoading(false);

// //         }
// //     };

// //     useEffect(() => {
// //         getSubmitClaim();
// //     }, []);

// //     if (loading) {
// //         return (
// //             <div className="space-y-4  p-4">

// //                 {Array.from({ length: 5 }).map((_, index) => (

// //                     <div
// //                         key={index}
// //                         className="border rounded-lg p-4 animate-pulse"
// //                     >

// //                         <div className="flex gap-4 flex-wrap">

// //                             <div className="h-5 w-24 bg-gray-300 rounded"></div>

// //                             <div className="h-5 w-20 bg-gray-300 rounded"></div>

// //                             <div className="h-5 w-32 bg-gray-300 rounded"></div>

// //                             <div className="h-5 w-40 bg-gray-300 rounded"></div>

// //                             <div className="h-5 w-24 bg-gray-300 rounded"></div>

// //                             <div className="h-10 w-36 bg-gray-300 rounded"></div>

// //                         </div>

// //                     </div>

// //                 ))}

// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="p-4 text-gray-500">

// //             {
// //                 submitClaimData.length > 0 ? (

// //                     <div className="space-y-4">

// //                         {
// //                             submitClaimData.map((ele) => (

// //                                 <div
// //                                     key={ele.claimId}
// //                                     className="border border-green-300 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
// //                                 >

// //                                     <div className="grid md:grid-cols-5 gap-4 mb-4">

// //                                         <div>
// //                                             <p className="text-sm text-gray-500">
// //                                                 Claim Amount
// //                                             </p>

// //                                             <p className="font-semibold">
// //                                                 ₹{ele.claimAmount}
// //                                             </p>
// //                                         </div>

// //                                         <div>
// //                                             <p className="text-sm text-gray-500">
// //                                                 Claim ID
// //                                             </p>

// //                                             <p className="font-semibold">
// //                                                 {ele.claimId}
// //                                             </p>
// //                                         </div>

// //                                         <div>
// //                                             <p className="text-sm text-gray-500">
// //                                                 Claim Number
// //                                             </p>

// //                                             <p className="font-semibold">
// //                                                 {ele.claimNumber}
// //                                             </p>
// //                                         </div>

// //                                         <div>
// //                                             <p className="text-sm text-gray-500">
// //                                                 Claim Reason
// //                                             </p>

// //                                             <p className="font-semibold">
// //                                                 {ele.claimReason}
// //                                             </p>
// //                                         </div>

// //                                         <div>
// //                                             <p className="text-sm text-gray-500">
// //                                                 Status
// //                                             </p>

// //                                             <span
// //                                                 className={`font-semibold ${
// //                                                     ele.claimStatus === "SUBMITTED"
// //                                                         ? "text-yellow-600"
// //                                                         : ele.claimStatus === "APPROVED"
// //                                                         ? "text-green-600"
// //                                                         : "text-red-600"
// //                                                 }`}
// //                                             >
// //                                                 {ele.claimStatus}
// //                                             </span>
// //                                         </div>

// //                                     </div>

// //                                     <NavLink
// //                                         className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
// //                                         to={`/${ele.claimId}/review`}
// //                                     >
// //                                         Review Claim
// //                                     </NavLink>

// //                                 </div>
// //                             ))
// //                         }

// //                     </div>

// //                 ) : (

// //                     <div className="text-center py-10">

// //                         <h2 className="text-2xl font-semibold text-gray-600">
// //                             No Submitted Claims Yet
// //                         </h2>

// //                     </div>

// //                 )
// //             }

// //         </div>
// //     );
// // };

// // export default GetSubmittedClaim;

// const GetSubmittedClaim = () => {
//     const [submitClaimData, setSubmitClaimData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showStudentModal, setShowStudentModal] = useState(false);
//     const [showCourseModal, setShowCourseModal] = useState(false);

//     const getSubmitClaim = async () => {

//         try {

//             setLoading(true);

//             const data = await getSubmittedClaim();

//             setSubmitClaimData(data || []);
//             console.log(data);

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Failed To Load Claims ❌"
//             );

//         } finally {

//             setLoading(false);

//         }
//     };

//     useEffect(() => {
//         getSubmitClaim();
//     }, []);

//     if (loading) {
//         return (
//             <div className="space-y-4  p-4">

//                 {Array.from({ length: 5 }).map((_, index) => (

//                     <div
//                         key={index}
//                         className="border rounded-lg p-4 animate-pulse"
//                     >

//                         <div className="flex gap-4 flex-wrap">

//                             <div className="h-5 w-24 bg-gray-300 rounded"></div>

//                             <div className="h-5 w-20 bg-gray-300 rounded"></div>

//                             <div className="h-5 w-32 bg-gray-300 rounded"></div>

//                             <div className="h-5 w-40 bg-gray-300 rounded"></div>

//                             <div className="h-5 w-24 bg-gray-300 rounded"></div>

//                             <div className="h-10 w-36 bg-gray-300 rounded"></div>

//                         </div>

//                     </div>

//                 ))}

//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center p-12 bg-slate-900 bg-fixed relative overflow-hidden">

//             {/* Background Gradients */}
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#8b5cf6_0%,transparent_30%),radial-gradient(circle_at_top_right,#06b6d4_0%,transparent_30%),radial-gradient(circle_at_bottom_center,#2563eb_0%,transparent_40%)] opacity-100" />

//             <div className="relative z-10">
//                 {submitClaimData && (
//                     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">

//                         <div className="w-[90%] max-w-7xl rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-3xl p-8 text-white shadow-[0_20px_80px_rgba(0,0,0,0.4),0_0_40px_rgba(99,102,241,0.25)]">

//                             {/* Header */}
//                             <div className="flex items-center justify-between mb-6">
//                                 <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
//                                     Subbmitted Claim
//                                 </h2>

//                                 <button
//                                     onClick={() => setShowStudentModal(false)}
//                                     className="
//                 w-11 h-11
//                 rounded-full
//                 bg-gradient-to-r
//                 from-red-500
//                 to-rose-500
//                 flex items-center justify-center
//                 transition-all duration-300
//                 hover:rotate-90 hover:scale-110
//                 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]
//               "
//                                 >
//                                     ✖
//                                 </button>
//                             </div>

//                             {/* Student Table */}
//                             <div className="overflow-x-auto rounded-2xl">
//                                 <table className="w-full border-collapse">
//                                     <thead className="bg-white/10">
//                                         <tr>
//                                             <th className="p-4 text-center text-xs uppercase tracking-widest text-slate-300">
//                                                 Claim Number
//                                             </th>
//                                             <th className="p-4 text-center text-xs uppercase tracking-widest text-slate-300">
//                                                 Claim Id
//                                             </th>
//                                             <th className="p-4 text-center text-xs uppercase tracking-widest text-slate-300">
//                                                 Claim Status
//                                             </th>
//                                             <th className="p-4 text-center text-xs uppercase tracking-widest text-slate-300">
//                                                 Claim Amount
//                                             </th>
//                                             <th className="p-4 text-center text-xs uppercase tracking-widest text-slate-300">
//                                                 Claim Reason
//                                             </th>
//                                             <th className="p-4 text-center text-xs uppercase tracking-widest text-slate-300">
//                                                 Action
//                                             </th>
//                                         </tr>
//                                     </thead>

//                                     <tbody>
//                                         {submitClaimData.map((ele, index) => (
//                                             <tr
//                                                 key={index}
//                                                 className="border-t border-white/10 transition-all duration-300 hover:bg-white/5 hover:scale-[1.01]"  >
//                                                 <td className="p-4 text-center">{ele.claimNumber}</td>
//                                                 <td className="p-4 text-center">{ele.claimId}</td>
//                                                 <td className="p-4 text-center">{ele.claimAmount}</td>
//                                                 <td className="p-4 text-center">{ele.claimStatus}</td>
//                                                 <td className="p-4 text-center">{ele.claimReason}</td>
//                                                 <td className="p-4 text-center">
//                                                     <NavLink
//                                                         to={`/${ele.claimId}/review`}
//                                                         className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/40">
//                                                         Review Claim
//                                                     </NavLink>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             {/* Courses Modal */}

//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default GetSubmittedClaim

import React, { useEffect, useState } from "react";
import { getSubmittedClaim } from "../services/claimService";
import { toast } from "react-toastify";
import AgentClaimReview from "./AgentClaimReview";

const GetSubmittedClaim = ({ onClose }) => {
    const [submitClaimData, setSubmitClaimData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showReviewModal, setShowReviewModal] =
        useState(false);

    const [selectedClaimId, setSelectedClaimId] =
        useState(null);

    const getSubmitClaim = async () => {
        try {
            setLoading(true);

            const data = await getSubmittedClaim();

            setSubmitClaimData(data || []);
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
        getSubmitClaim();
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-xl">

                <div className="w-[90%] max-w-6xl rounded-3xl bg-slate-900 border border-white/10 p-8">

                    <div className="space-y-4">

                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-16 rounded-xl bg-white/10 animate-pulse"
                            />
                        ))}

                    </div>

                </div>

            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-xl p-6">

                <div
                    className="
                        w-full
                        max-w-7xl
                        max-h-[90vh]
                        overflow-hidden
                        rounded-[32px]
                        border
                        border-white/10
                        bg-slate-900/90
                        backdrop-blur-3xl
                        shadow-2xl
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
                            border-white/10
                        "
                    >
                        <div>

                            <h2
                                className="
                                    text-3xl
                                    font-bold
                                    bg-gradient-to-r
                                    from-cyan-400
                                    to-indigo-400
                                    bg-clip-text
                                    text-transparent
                                "
                            >
                                Submitted Claims
                            </h2>

                            <p className="text-slate-400 mt-1">
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
                                hover:scale-110
                                hover:rotate-90
                            "
                        >
                            ✕
                        </button>
                    </div>

                    {/* TABLE */}

                    <div className="overflow-auto max-h-[70vh]">

                        {submitClaimData.length > 0 ? (

                            <table className="w-full">

                                <thead className="sticky top-0 bg-slate-900 z-10">

                                    <tr className="border-b border-white/10">

                                        <th className="p-4 text-slate-300 text-sm uppercase">
                                            Claim Number
                                        </th>

                                        <th className="p-4 text-slate-300 text-sm uppercase">
                                            Claim ID
                                        </th>

                                        <th className="p-4 text-slate-300 text-sm uppercase">
                                            Amount
                                        </th>

                                        <th className="p-4 text-slate-300 text-sm uppercase">
                                            Status
                                        </th>

                                        <th className="p-4 text-slate-300 text-sm uppercase">
                                            Reason
                                        </th>

                                        <th className="p-4 text-slate-300 text-sm uppercase">
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
                                                border-white/5
                                                hover:bg-white/5
                                                transition
                                            "
                                        >
                                            <td className="p-4 text-center text-white">
                                                {claim.claimNumber}
                                            </td>

                                            <td className="p-4 text-center text-white">
                                                {claim.claimId}
                                            </td>

                                            <td className="p-4 text-center text-white">
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
                                                            ? "bg-yellow-500/20 text-yellow-400"
                                                            : claim.claimStatus === "APPROVED"
                                                                ? "bg-green-500/20 text-green-400"
                                                                : "bg-red-500/20 text-red-400"
                                                        }
                                                    `}
                                                >
                                                    {claim.claimStatus}
                                                </span>

                                            </td>

                                            <td className="p-4 text-center text-slate-300">
                                                {claim.claimReason}
                                            </td>

                                            <td className="p-4 text-center">

                                                <button
                                                    onClick={() => {
                                                        setSelectedClaimId(
                                                            claim.claimId
                                                        );

                                                        setShowReviewModal(
                                                            true
                                                        );
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

                                <h2 className="text-2xl text-white font-bold mb-3">
                                    No Submitted Claims
                                </h2>

                                <p className="text-slate-400">
                                    There are currently no submitted claims available.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

            {/* NESTED REVIEW MODAL */}

            {showReviewModal && selectedClaimId && (

                <AgentClaimReview
                    claimId={selectedClaimId}
                    isModal={true}
                    onClose={() => {
                        setShowReviewModal(false);
                        setSelectedClaimId(null);

                        getSubmitClaim();
                    }}
                />

            )}
        </>
    );
};

export default GetSubmittedClaim;