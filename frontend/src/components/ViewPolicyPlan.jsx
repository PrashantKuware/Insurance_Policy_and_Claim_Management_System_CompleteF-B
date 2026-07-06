import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShieldAlt, FaPlus, FaArrowLeft, FaInbox } from "react-icons/fa";
import PageLayout from "./common/PageLayout";
import PageHeader from "./common/PageHeader";
import GlassCard from "./common/GlassCard";
import LoadingSpinner from "./common/LoadingSpinner";
import formatCurrency from "../utils/formatCurrency";
import { getProductById } from "../services/ProductService";
import { getPolicyByProductId } from "../services/PlanServices";

const ViewPolicyPlan = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const [prodData, plansData] = await Promise.all([
          getProductById(productId),
          getPolicyByProductId(productId),
        ]);
        setProduct(prodData);
        setPlans(plansData || []);
      } catch (err) {
        toast.error("Failed to load policy plans for this product");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [productId]);

  if (loading) return <LoadingSpinner fullPage message="Fetching plans..." />;

  return (
    <PageLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <PageHeader
            title={product ? `${product.productName} Plans` : "Policy Plans"}
            subtitle={product ? `${product.description}` : "Browse specific coverage schedules."}
            showBreadcrumbs={false}
          />
        </div>

        {role === "ADMIN" && (
          <button
            type="button"
            onClick={() => navigate(`/addplan/${productId}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <FaPlus className="w-3 h-3" /> Add Policy Plan
          </button>
        )}
      </div>

      {plans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {plans.map((plan) => (
            <GlassCard key={plan.planId} hoverable className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 rounded-full uppercase tracking-wider">
                    {plan.premiumType}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    ID: #{plan.planId}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                  {plan.policyName || "Premium Protection"}
                </h3>

                <div className="space-y-3.5 my-5 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Coverage</span>
                    <span className="font-extrabold text-slate-800 dark:text-white">
                      {formatCurrency(plan.coverageAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Premium Amount</span>
                    <span className="font-extrabold text-slate-800 dark:text-white">
                      {formatCurrency(plan.premiumAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Min Term</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {plan.minimumTerm} years
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Max Term</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {plan.maximumTerm} years
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-850">
                {role === "CUSTOMER" ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/purchasepolicy/${plan.planId}`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-[0.97]"
                  >
                    <FaShieldAlt className="w-3.5 h-3.5" /> Purchase Policy
                  </button>
                ) : (
                  <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {role || "Guest"} Account
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center text-slate-400">
          <FaInbox className="w-12 h-12 mb-4" />
          <p className="text-sm font-semibold mb-2">No policy plans configured for this product category.</p>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Please ask the administrator to create active policy structures under this product category.
          </p>
        </div>
      )}
    </PageLayout>
  );
};

export default ViewPolicyPlan;
