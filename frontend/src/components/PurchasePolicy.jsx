import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShieldAlt, FaCreditCard, FaArrowLeft } from "react-icons/fa";
import PageLayout from "./common/PageLayout";
import PageHeader from "./common/PageHeader";
import FormInput from "./common/FormInput";
import FormSelect from "./common/FormSelect";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import GlassCard from "./common/GlassCard";
import LoadingSpinner from "./common/LoadingSpinner";
import formatCurrency from "../utils/formatCurrency";
import { getPlanById } from "../services/PlanServices";
import { purchasePolicy, payPremium } from "../services/PolicyService";

const PurchasePolicy = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [loadingPlan, setLoadingPlan] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [plan, setPlan] = useState(null);

  const [term, setTerm] = useState("");
  const [paymentType, setPaymentType] = useState("");
  
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await getPlanById(planId);
        setPlan(data);
        // Default to min term
        setTerm(String(data.minimumTerm));
        // Default to plan premiumType
        setPaymentType(data.premiumType);
      } catch (err) {
        toast.error("Failed to fetch policy plan specifications");
        navigate(-1);
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, [planId, navigate]);

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();

    const valErrors = {};
    if (!term || Number(term) < plan.minimumTerm || Number(term) > plan.maximumTerm) {
      valErrors.term = `Term must be between ${plan.minimumTerm} and ${plan.maximumTerm} years`;
    }
    if (!paymentType) valErrors.paymentType = "Payment type is required";
    
    // Card checks
    if (!paymentForm.cardNumber.trim() || paymentForm.cardNumber.replace(/\s/g, "").length !== 16) {
      valErrors.cardNumber = "Enter valid 16-digit card number";
    }
    if (!paymentForm.cardHolder.trim()) valErrors.cardHolder = "Card holder name is required";
    if (!paymentForm.expiryDate.trim()) valErrors.expiryDate = "Card expiry is required";
    if (!paymentForm.cvv.trim() || paymentForm.cvv.length !== 3) {
      valErrors.cvv = "Enter valid 3-digit CVV";
    }

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setPurchasing(true);
    try {
      // 1. Purchase Policy
      const policyResponse = await purchasePolicy({
        planId: Number(planId),
        policyTerm: Number(term),
      });

      const policyId = policyResponse.policyId;

      // 2. Pay Premium Amount immediately to activate the transaction
      await payPremium(policyId, {
        paymentType: paymentType,
        amount: plan.premiumAmount,
        cardDetails: `Card ending with ${paymentForm.cardNumber.slice(-4)}`,
      });

      toast.success("Policy purchased and initial premium paid successfully! 🛡️");
      navigate("/customerdashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to purchase policy");
    } finally {
      setPurchasing(false);
    }
  };

  if (loadingPlan) return <LoadingSpinner fullPage message="Configuring policy checkout..." />;

  return (
    <PageLayout>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title="Checkout Coverage"
          subtitle="Configure parameters and authorize mock initial premium payment."
          showBreadcrumbs={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-2">
        {/* Left: Purchase Info */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
              Plan Specifications
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Coverage Package</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{plan.policyName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Premium Cost</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(plan.premiumAmount)}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Coverage</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(plan.coverageAmount)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Min Term</span>
                  <p className="text-sm font-bold text-slate-850 dark:text-slate-200">{plan.minimumTerm} Years</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Max Term</span>
                  <p className="text-sm font-bold text-slate-850 dark:text-slate-200">{plan.maximumTerm} Years</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Premium Frequency</span>
                <p className="text-xs font-bold text-slate-800 dark:text-white uppercase">{plan.premiumType}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right: Forms Checkout */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8" hoverable={false}>
            <form onSubmit={handlePurchaseSubmit} className="space-y-6">
              <h3 className="text-base font-bold text-slate-850 dark:text-white mb-4">
                Checkout Settings & Payment
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label={`Policy Term (Years: ${plan.minimumTerm}-${plan.maximumTerm})`}
                  id="term"
                  name="term"
                  type="number"
                  placeholder="e.g. 10"
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setErrors((prev) => ({ ...prev, term: "" }));
                  }}
                  error={errors.term}
                  required
                />

                <FormSelect
                  label="Premium Type"
                  id="paymentType"
                  name="paymentType"
                  value={paymentType}
                  onChange={(e) => {
                    setPaymentType(e.target.value);
                    setErrors((prev) => ({ ...prev, paymentType: "" }));
                  }}
                  options={[
                    { label: "ANNUAL", value: "ANNUAL" },
                    { label: "ONE_TIME", value: "ONE_TIME" },
                  ]}
                  error={errors.paymentType}
                  required
                />
              </div>

              {/* Payment Section */}
              <div className="border-t border-slate-200/50 dark:border-slate-850 pt-5 space-y-4">
                <div className="flex items-center gap-2 text-slate-850 dark:text-white font-bold text-sm">
                  <FaCreditCard className="text-blue-500" /> Card Information
                </div>

                <FormInput
                  label="Card Number"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={paymentForm.cardNumber}
                  onChange={handlePaymentChange}
                  error={errors.cardNumber}
                  required
                />

                <FormInput
                  label="Card Holder Name"
                  id="cardHolder"
                  name="cardHolder"
                  placeholder="John Doe"
                  value={paymentForm.cardHolder}
                  onChange={handlePaymentChange}
                  error={errors.cardHolder}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Expiry Date"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentForm.expiryDate}
                    onChange={handlePaymentChange}
                    error={errors.expiryDate}
                    required
                  />

                  <FormInput
                    label="CVV"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    type="password"
                    value={paymentForm.cvv}
                    onChange={handlePaymentChange}
                    error={errors.cvv}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800">
                <SecondaryButton onClick={() => navigate(-1)} disabled={purchasing}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  type="submit"
                  loading={purchasing}
                  icon={FaShieldAlt}
                  className="shadow-blue-500/10"
                >
                  Pay {formatCurrency(plan.premiumAmount)} & Activate
                </PrimaryButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </PageLayout>
  );
};

export default PurchasePolicy;
