import React, { useEffect, useState } from 'react';
import { getAllPoliciesByCustomer } from '../services/policyService';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyPolicies = () => {

    const [policyData, setPolicyData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getMyPolicies = async () => {

        try {

            setLoading(true);

            const data = await getAllPoliciesByCustomer();

            setPolicyData(data || []);

            console.log(data);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Policies ❌"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        getMyPolicies();
    }, []);

    if (loading) {

        return (
            <div className="p-4 space-y-4">

                {Array.from({ length: 5 }).map((_, index) => (

                    <div
                        key={index}
                        className="border rounded-xl p-5 animate-pulse"
                    >

                        <div className="flex flex-wrap gap-4">

                            <div className="h-5 w-32 bg-gray-300 rounded"></div>
                            <div className="h-5 w-24 bg-gray-300 rounded"></div>
                            <div className="h-5 w-40 bg-gray-300 rounded"></div>
                            <div className="h-5 w-20 bg-gray-300 rounded"></div>
                            <div className="h-5 w-36 bg-gray-300 rounded"></div>
                            <div className="h-5 w-28 bg-gray-300 rounded"></div>

                        </div>

                    </div>

                ))}

            </div>
        );
    }

    return (
        <div className="p-4">

            {
                policyData.length > 0 ? (

                    <div className="space-y-4">

                        {
                            policyData.map((ele) => (

                                <div
                                    key={ele.policyId}
                                    className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5"
                                >

                                    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Customer Name
                                            </p>

                                            <p className="font-semibold">
                                                {ele.customerName}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Plan Name
                                            </p>

                                            <p className="font-semibold">
                                                {ele.planName}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Policy ID
                                            </p>

                                            <p className="font-semibold">
                                                {ele.policyId}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Policy Number
                                            </p>

                                            <p className="font-semibold">
                                                {ele.policyNumber}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Start Date
                                            </p>

                                            <p className="font-semibold">
                                                {ele.startDate}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                End Date
                                            </p>

                                            <p className="font-semibold">
                                                {ele.endDate}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Premium Paid
                                            </p>

                                            <p className="font-semibold">
                                                ₹{ele.totalPremiumPaid}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Status
                                            </p>

                                            <span
                                                className={`font-semibold ${
                                                    ele.policyStatus === "ACTIVE"
                                                        ? "text-green-600"
                                                        : ele.policyStatus === "EXPIRED"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                }`}
                                            >
                                                {ele.policyStatus}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="mt-5">

                                        <NavLink
                                            to={`/policy/${ele.policyId}`}
                                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            View Claim
                                        </NavLink>

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                ) : (

                    <div className="text-center py-12">

                        <h2 className="text-2xl font-semibold text-gray-600">
                            No Policies Found
                        </h2>

                    </div>

                )
            }

        </div>
    );
};

export default MyPolicies;