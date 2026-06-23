import React, { useEffect, useState } from 'react';
import { getSubmittedClaim } from '../services/claimService';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

const GetSubmittedClaim = () => {

    const [submitClaimData, setSubmitClaimData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getSubmitClaim = async () => {

        try {

            setLoading(true);

            const data = await getSubmittedClaim();

            setSubmitClaimData(data || []);

            console.log(data);

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
            <div className="space-y-4 p-4">

                {Array.from({ length: 5 }).map((_, index) => (

                    <div
                        key={index}
                        className="border rounded-lg p-4 animate-pulse"
                    >

                        <div className="flex gap-4 flex-wrap">

                            <div className="h-5 w-24 bg-gray-300 rounded"></div>

                            <div className="h-5 w-20 bg-gray-300 rounded"></div>

                            <div className="h-5 w-32 bg-gray-300 rounded"></div>

                            <div className="h-5 w-40 bg-gray-300 rounded"></div>

                            <div className="h-5 w-24 bg-gray-300 rounded"></div>

                            <div className="h-10 w-36 bg-gray-300 rounded"></div>

                        </div>

                    </div>

                ))}

            </div>
        );
    }

    return (
        <div className="p-4">

            {
                submitClaimData.length > 0 ? (

                    <div className="space-y-4">

                        {
                            submitClaimData.map((ele) => (

                                <div
                                    key={ele.claimId}
                                    className="border border-green-300 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
                                >

                                    <div className="grid md:grid-cols-5 gap-4 mb-4">

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Claim Amount
                                            </p>

                                            <p className="font-semibold">
                                                ₹{ele.claimAmount}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Claim ID
                                            </p>

                                            <p className="font-semibold">
                                                {ele.claimId}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Claim Number
                                            </p>

                                            <p className="font-semibold">
                                                {ele.claimNumber}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Claim Reason
                                            </p>

                                            <p className="font-semibold">
                                                {ele.claimReason}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Status
                                            </p>

                                            <span
                                                className={`font-semibold ${
                                                    ele.claimStatus === "SUBMITTED"
                                                        ? "text-yellow-600"
                                                        : ele.claimStatus === "APPROVED"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {ele.claimStatus}
                                            </span>
                                        </div>

                                    </div>

                                    <NavLink
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        to={`/${ele.claimId}/review`}
                                    >
                                        Review Claim
                                    </NavLink>

                                </div>
                            ))
                        }

                    </div>

                ) : (

                    <div className="text-center py-10">

                        <h2 className="text-2xl font-semibold text-gray-600">
                            No Submitted Claims Yet
                        </h2>

                    </div>

                )
            }

        </div>
    );
};

export default GetSubmittedClaim;