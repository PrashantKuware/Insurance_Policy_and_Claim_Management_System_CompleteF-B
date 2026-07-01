// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getPolicyByPlanId } from '../services/PlanServices';
// import { purchasePolicy } from '../services/policyService';
// import { payForPolicy } from '../services/paymentService';
// import { toast } from 'react-toastify';

// const PurchasePolicy = () => {

//     const { planId } = useParams();

//     const [planData, setPlanData] = useState({});
//     const [policyBtn, setPolicyBtn] = useState(false);
//     const [policyId, setPolicyId] = useState(null);

//     const [loading, setLoading] = useState(true);
//     const [purchaseLoading, setPurchaseLoading] = useState(false);
//     const [paymentLoading, setPaymentLoading] = useState(false);

//     const navigate = useNavigate();

//     useEffect(() => {
//         getPolicyById();
//     }, [planId]);

//     const getPolicyById = async () => {

//         try {

//             setLoading(true);

//             const data = await getPolicyByPlanId(planId);

//             setPlanData(data);

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Failed To Load Plan Details ❌"
//             );

//         } finally {

//             setLoading(false);

//         }
//     };

//     const handlePurchase = async () => {

//         try {

//             setPurchaseLoading(true);

//             const data = await purchasePolicy(planId);

//             setPolicyId(data.policyId);

//             setPolicyBtn(true);

//             toast.success(
//                 "Policy Purchased Successfully ✅"
//             );

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Failed To Purchase Policy ❌"
//             );

//         } finally {

//             setPurchaseLoading(false);

//         }
//     };

//     const purchasiingPolicyPayment = async () => {

//         try {

//             setPaymentLoading(true);

//             await payForPolicy(
//                 policyId,
//                 planData.premiumAmount
//             );

//             toast.success(
//                 "Payment Successful ✅"
//             );

//             setTimeout(() => {
//                 navigate("/customerdashboard");
//             }, 1000);

//         } catch (error) {

//             console.error(error);

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Payment Failed ❌"
//             );

//         } finally {

//             setPaymentLoading(false);

//         }
//     };

//     if (loading) {

//         return (
//             <div className="max-w-4xl mx-auto p-6">

//                 <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">

//                     <div className="h-8 w-56 bg-gray-300 rounded mb-6"></div>

//                     <div className="space-y-4">

//                         <div className="h-5 w-64 bg-gray-300 rounded"></div>
//                         <div className="h-5 w-56 bg-gray-300 rounded"></div>
//                         <div className="h-5 w-40 bg-gray-300 rounded"></div>
//                         <div className="h-5 w-48 bg-gray-300 rounded"></div>
//                         <div className="h-5 w-60 bg-gray-300 rounded"></div>

//                     </div>

//                     <div className="h-12 w-48 bg-gray-300 rounded mt-8"></div>

//                 </div>

//             </div>
//         );
//     }

//     return (
//         <div className="max-w-4xl mx-auto p-6 text-gray-500">

//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

//                 <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6">

//                     <h2 className="text-3xl font-bold">
//                         Purchase Policy
//                     </h2>

//                     <p className="opacity-90 mt-2">
//                         Review your selected insurance plan
//                     </p>

//                 </div>

//                 <div className="p-6">

//                     <div className="grid md:grid-cols-2 gap-6">

//                         <div>

//                             <p className="text-gray-500 text-sm">
//                                 Plan Name
//                             </p>

//                             <h3 className="text-xl font-semibold">
//                                 {planData.planName}
//                             </h3>

//                         </div>

//                         <div>

//                             <p className="text-gray-500 text-sm">
//                                 Product
//                             </p>

//                             <h3 className="text-xl font-semibold">
//                                 {planData.productName}
//                             </h3>

//                         </div>

//                         <div>

//                             <p className="text-gray-500 text-sm">
//                                 Premium Amount
//                             </p>

//                             <h3 className="text-xl font-semibold text-green-600">
//                                 ₹{planData.premiumAmount}
//                             </h3>

//                         </div>

//                         <div>

//                             <p className="text-gray-500 text-sm">
//                                 Duration
//                             </p>

//                             <h3 className="text-xl font-semibold">
//                                 {planData.duration} Years
//                             </h3>

//                         </div>

//                         <div>

//                             <p className="text-gray-500 text-sm">
//                                 Coverage Amount
//                             </p>

//                             <h3 className="text-xl font-semibold text-blue-600">
//                                 ₹{planData.coverageAmount}
//                             </h3>

//                         </div>

//                         <div>

//                             <p className="text-gray-500 text-sm">
//                                 Premium Type
//                             </p>

//                             <h3 className="text-xl font-semibold">
//                                 {planData.premiumType}
//                             </h3>

//                         </div>

//                     </div>

//                     {!policyBtn && (

//                         <button
//                             onClick={handlePurchase}
//                             disabled={purchaseLoading}
//                             className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
//                         >

//                             {
//                                 purchaseLoading ? (
//                                     <div className="flex items-center gap-2">

//                                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

//                                         Purchasing...

//                                     </div>
//                                 ) : (
//                                     "🛒 Purchase Policy"
//                                 )
//                             }

//                         </button>

//                     )}

//                     {policyBtn && (

//                         <div className="mt-8 border-t pt-6">

//                             <h3 className="text-2xl font-bold text-green-600 mb-2">
//                                 Policy Created Successfully 🎉
//                             </h3>

//                             <p className="text-gray-600 mb-6">
//                                 Complete your premium payment to activate the policy.
//                             </p>

//                             <button
//                                 onClick={purchasiingPolicyPayment}
//                                 disabled={paymentLoading}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
//                             >

//                                 {
//                                     paymentLoading ? (
//                                         <div className="flex items-center gap-2">

//                                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

//                                             Processing Payment...

//                                         </div>
//                                     ) : (
//                                         `Pay ₹${planData.premiumAmount}`
//                                     )
//                                 }

//                             </button>

//                         </div>

//                     )}

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default PurchasePolicy;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPolicyByPlanId } from '../services/PlanServices';
import { purchasePolicy } from '../services/policyService';
import { payForPolicy } from '../services/paymentService';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaShoppingCart, FaCreditCard, FaRegCheckCircle, FaShieldAlt, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

// Glowing Cyber Ambient Effects
const Orbs = () => (
  <>
    <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/5 top-[-200px] left-[-10%] blur-3xl animate-float" />
    <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-500/5 to-indigo-500/10 bottom-[-100px] right-[-10%] blur-3xl animate-float delay-2000" />
  </>
);

const PurchasePolicy = () => {
    const { planId } = useParams();
    const navigate = useNavigate();

    const [planData, setPlanData] = useState({});
    const [policyBtn, setPolicyBtn] = useState(false);
    const [policyId, setPolicyId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

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
            toast.success("Policy Purchased Successfully ✅");
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
            await payForPolicy(policyId, planData.premiumAmount);
            toast.success("Payment Successful ✅");
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

    // --- 1. CYBER SKELETON SHIMMER LOADING ---
    if (loading) {
        return (
            <div className="relative min-h-screen bg-[#070d19] p-6 md:p-10 text-slate-300 overflow-hidden flex items-center justify-center">
                <Orbs />
                <div className="w-full max-w-3xl bg-[#111c30]/50 border border-slate-900 rounded-3xl p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/10 to-transparent -translate-x-full animate-shimmer" />
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-800 rounded-xl" />
                        <div className="h-8 w-48 bg-slate-800 rounded-xl" />
                    </div>
                    <div className="h-24 w-full bg-slate-900/60 rounded-2xl" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-14 bg-slate-900/40 rounded-xl" />
                        <div className="h-14 bg-slate-900/40 rounded-xl" />
                        <div className="h-14 bg-slate-900/40 rounded-xl" />
                        <div className="h-14 bg-slate-900/40 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#070d19] p-6 md:p-10 text-slate-300 overflow-hidden flex flex-col justify-center items-center">
            <Orbs />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full max-w-3xl z-10"
            >
                {/* --- BACK NAVIGATION ACTION --- */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 text-sm font-semibold text-slate-400 hover:text-white transition-all group"
                >
                    <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" /> 
                    Back to Plans
                </button>

                {/* --- MAIN CORE INTERACTION CONTAINER --- */}
                <div className="bg-[#111c30] border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/[0.01] pointer-events-none" />

                    {/* Matrix Header Banner */}
                    <div className="bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-indigo-950/40 p-6 md:p-8 border-b border-slate-900 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">
                                Purchase Policy
                            </h2>
                            <p className="text-slate-500 text-xs mt-1">
                                Review ledger details before deploying cryptographic framework
                            </p>
                        </div>
                        <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-900 text-xs font-mono font-bold text-cyan-400 shrink-0">
                            ID: {planId?.slice(0, 6)}...
                        </span>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* Summary Grid Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
                            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl">
                                <p className="text-slate-500 text-[11px] uppercase tracking-wider mb-1">Plan Configuration</p>
                                <h3 className="text-base font-bold text-white truncate">{planData.planName}</h3>
                            </div>

                            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl">
                                <p className="text-slate-500 text-[11px] uppercase tracking-wider mb-1">Parent Product</p>
                                <h3 className="text-base font-bold text-slate-300 truncate">{planData.productName}</h3>
                            </div>

                            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-center gap-3">
                                <FaMoneyBillWave className="text-emerald-500 text-xl shrink-0" />
                                <div>
                                    <p className="text-slate-500 text-[11px] uppercase tracking-wider mb-0.5">Premium Charge</p>
                                    <h3 className="text-lg font-black text-emerald-400">₹{planData.premiumAmount?.toLocaleString('en-IN')}</h3>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-center gap-3">
                                <FaCalendarAlt className="text-cyan-400 text-xl shrink-0" />
                                <div>
                                    <p className="text-slate-500 text-[11px] uppercase tracking-wider mb-0.5">Matrix Duration</p>
                                    <h3 className="text-lg font-black text-slate-200">{planData.duration} Years</h3>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-center gap-3">
                                <FaShieldAlt className="text-purple-400 text-xl shrink-0" />
                                <div>
                                    <p className="text-slate-500 text-[11px] uppercase tracking-wider mb-0.5">Coverage Valuation</p>
                                    <h3 className="text-lg font-black text-purple-400">₹{planData.coverageAmount?.toLocaleString('en-IN')}</h3>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-center gap-3">
                                <FaCreditCard className="text-amber-500 text-xl shrink-0" />
                                <div>
                                    <p className="text-slate-500 text-[11px] uppercase tracking-wider mb-0.5">Premium Modality</p>
                                    <h3 className="text-lg font-black text-slate-200">{planData.premiumType}</h3>
                                </div>
                            </div>
                        </div>

                        {/* --- GATEWAY INTERACTIVE ACTIONS CONTROLLERS --- */}
                        <AnimatePresence mode="wait">
                            {!policyBtn ? (
                                <motion.div
                                    key="purchase-btn-gate"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <button
                                        onClick={handlePurchase}
                                        disabled={purchaseLoading}
                                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-emerald-400 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 hover:border-transparent transition-all duration-200 disabled:opacity-40"
                                    >
                                        {purchaseLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                                Constructing Pipeline...
                                            </>
                                        ) : (
                                            <>
                                                <FaShoppingCart size={13} /> Confirm & Build Policy
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="payment-btn-gate"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-5 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl space-y-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <FaRegCheckCircle size={22} className="text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="text-lg font-bold text-emerald-400">
                                                Policy Created Successfully 🎉
                                            </h3>
                                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                                Ledger authenticated. Complete your core premium transaction routing to immediately activate insurance nodes.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-900/60">
                                        <button
                                            onClick={purchasiingPolicyPayment}
                                            disabled={paymentLoading}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-cyan-400 bg-cyan-500/10 hover:bg-cyan-600 hover:text-white border border-cyan-500/20 hover:border-transparent transition-all duration-200 disabled:opacity-40"
                                        >
                                            {paymentLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                                    Processing Premium Escrow...
                                                </>
                                            ) : (
                                                <>
                                                    <FaCreditCard size={13} /> Finalize Payment (₹{planData.premiumAmount?.toLocaleString('en-IN')})
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Embedded CSS Engine Extensions */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-20px) scale(1.03); }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-float { animation: float 12s ease-in-out infinite; }
                .animate-shimmer { animation: shimmer 1.8s infinite; }
                .delay-2000 { animation-delay: 3.5s; }
            `}</style>
        </div>
    );
};

export default PurchasePolicy;