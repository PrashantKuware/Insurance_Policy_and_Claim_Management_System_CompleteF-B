import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPolicyByPlanId } from '../services/PlanServices';
import { purchasePolicy } from '../services/policyService';
import { payForPolicy } from '../services/paymentService';
import { toast } from 'react-toastify';

const PurchasePolicy = () => {

    const { planId } = useParams();

    const [planData, setPlanData] = useState({});
    const [policyBtn, setPolicyBtn] = useState(false);
    const [policyId, setPolicyId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getPolicyById();
    }, [planId]);

    const getPolicyById = async () => {

        try {

            setLoading(true);

            const data = await getPolicyByPlanId(planId);

            setPlanData(data);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Plan Details ❌"
            );

        } finally {

            setLoading(false);

        }
    };

    const handlePurchase = async () => {

        try {

            setPurchaseLoading(true);

            const data = await purchasePolicy(planId);

            setPolicyId(data.policyId);

            setPolicyBtn(true);

            toast.success(
                "Policy Purchased Successfully ✅"
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed To Purchase Policy ❌"
            );

        } finally {

            setPurchaseLoading(false);

        }
    };

    const purchasiingPolicyPayment = async () => {

        try {

            setPaymentLoading(true);

            await payForPolicy(
                policyId,
                planData.premiumAmount
            );

            toast.success(
                "Payment Successful ✅"
            );

            setTimeout(() => {
                navigate("/customerdashboard");
            }, 1000);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Payment Failed ❌"
            );

        } finally {

            setPaymentLoading(false);

        }
    };

    if (loading) {

        return (
            <div className="max-w-4xl mx-auto p-6">

                <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">

                    <div className="h-8 w-56 bg-gray-300 rounded mb-6"></div>

                    <div className="space-y-4">

                        <div className="h-5 w-64 bg-gray-300 rounded"></div>
                        <div className="h-5 w-56 bg-gray-300 rounded"></div>
                        <div className="h-5 w-40 bg-gray-300 rounded"></div>
                        <div className="h-5 w-48 bg-gray-300 rounded"></div>
                        <div className="h-5 w-60 bg-gray-300 rounded"></div>

                    </div>

                    <div className="h-12 w-48 bg-gray-300 rounded mt-8"></div>

                </div>

            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

                <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6">

                    <h2 className="text-3xl font-bold">
                        Purchase Policy
                    </h2>

                    <p className="opacity-90 mt-2">
                        Review your selected insurance plan
                    </p>

                </div>

                <div className="p-6">

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Plan Name
                            </p>

                            <h3 className="text-xl font-semibold">
                                {planData.planName}
                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">
                                Product
                            </p>

                            <h3 className="text-xl font-semibold">
                                {planData.productName}
                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">
                                Premium Amount
                            </p>

                            <h3 className="text-xl font-semibold text-green-600">
                                ₹{planData.premiumAmount}
                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">
                                Duration
                            </p>

                            <h3 className="text-xl font-semibold">
                                {planData.duration} Years
                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">
                                Coverage Amount
                            </p>

                            <h3 className="text-xl font-semibold text-blue-600">
                                ₹{planData.coverageAmount}
                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">
                                Premium Type
                            </p>

                            <h3 className="text-xl font-semibold">
                                {planData.premiumType}
                            </h3>

                        </div>

                    </div>

                    {!policyBtn && (

                        <button
                            onClick={handlePurchase}
                            disabled={purchaseLoading}
                            className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                        >

                            {
                                purchaseLoading ? (
                                    <div className="flex items-center gap-2">

                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                        Purchasing...

                                    </div>
                                ) : (
                                    "🛒 Purchase Policy"
                                )
                            }

                        </button>

                    )}

                    {policyBtn && (

                        <div className="mt-8 border-t pt-6">

                            <h3 className="text-2xl font-bold text-green-600 mb-2">
                                Policy Created Successfully 🎉
                            </h3>

                            <p className="text-gray-600 mb-6">
                                Complete your premium payment to activate the policy.
                            </p>

                            <button
                                onClick={purchasiingPolicyPayment}
                                disabled={paymentLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                            >

                                {
                                    paymentLoading ? (
                                        <div className="flex items-center gap-2">

                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                            Processing Payment...

                                        </div>
                                    ) : (
                                        `Pay ₹${planData.premiumAmount}`
                                    )
                                }

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default PurchasePolicy;