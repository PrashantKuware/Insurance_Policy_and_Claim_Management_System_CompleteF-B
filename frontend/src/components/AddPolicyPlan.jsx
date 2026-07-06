import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlusCircle, FaArrowLeft } from "react-icons/fa";
import PageLayout from "./common/PageLayout";
import PageHeader from "./common/PageHeader";
import FormInput from "./common/FormInput";
import FormSelect from "./common/FormSelect";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import GlassCard from "./common/GlassCard";
import { addPlan } from "../services/PlanServices";

const AddPolicyPlan = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    policyName: "",
    premiumAmount: "",
    coverageAmount: "",
    minimumTerm: "",
    maximumTerm: "",
    minimumAge: "",
    maximumAge: "",
    premiumType: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valErrors = {};
    if (!formData.policyName.trim()) valErrors.policyName = "Policy Name is required";
    if (!formData.premiumAmount || Number(formData.premiumAmount) <= 0) valErrors.premiumAmount = "Enter valid premium amount";
    if (!formData.coverageAmount || Number(formData.coverageAmount) <= 0) valErrors.coverageAmount = "Enter valid coverage amount";
    if (!formData.minimumTerm || Number(formData.minimumTerm) <= 0) valErrors.minimumTerm = "Enter valid min term";
    if (!formData.maximumTerm || Number(formData.maximumTerm) <= 0) valErrors.maximumTerm = "Enter valid max term";
    if (!formData.minimumAge || Number(formData.minimumAge) <= 0) valErrors.minimumAge = "Enter valid min age";
    if (!formData.maximumAge || Number(formData.maximumAge) <= 0) valErrors.maximumAge = "Enter valid max age";
    if (!formData.premiumType) valErrors.premiumType = "Select premium payment type";

    // Term checks
    if (Number(formData.minimumTerm) > Number(formData.maximumTerm)) {
      valErrors.minimumTerm = "Min term cannot exceed max term";
    }
    // Age checks
    if (Number(formData.minimumAge) > Number(formData.maximumAge)) {
      valErrors.minimumAge = "Min age cannot exceed max age";
    }

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setLoading(true);
    try {
      await addPlan({
        policyName: formData.policyName,
        premiumAmount: Number(formData.premiumAmount),
        coverageAmount: Number(formData.coverageAmount),
        minimumTerm: Number(formData.minimumTerm),
        maximumTerm: Number(formData.maximumTerm),
        minimumAge: Number(formData.minimumAge),
        maximumAge: Number(formData.maximumAge),
        premiumType: formData.premiumType,
        productId: Number(productId), // link plan to product
      });

      toast.success("Policy Plan added successfully ✨");
      navigate(`/viewallplan/${productId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add policy plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Add Policy Plan"
        subtitle={`Configure the premium and coverage rules under Product #${productId}`}
      />

      <div className="flex justify-center mt-2">
        <GlassCard hoverable={false} className="w-full max-w-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Policy Plan Name"
              id="policyName"
              name="policyName"
              placeholder="e.g. Life Golden Term"
              value={formData.policyName}
              onChange={handleChange}
              error={errors.policyName}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Premium Amount"
                id="premiumAmount"
                name="premiumAmount"
                type="number"
                placeholder="₹ Amount"
                value={formData.premiumAmount}
                onChange={handleChange}
                error={errors.premiumAmount}
                required
              />

              <FormInput
                label="Coverage Amount"
                id="coverageAmount"
                name="coverageAmount"
                type="number"
                placeholder="₹ Coverage Limit"
                value={formData.coverageAmount}
                onChange={handleChange}
                error={errors.coverageAmount}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Minimum Term (Years)"
                id="minimumTerm"
                name="minimumTerm"
                type="number"
                placeholder="e.g. 5"
                value={formData.minimumTerm}
                onChange={handleChange}
                error={errors.minimumTerm}
                required
              />

              <FormInput
                label="Maximum Term (Years)"
                id="maximumTerm"
                name="maximumTerm"
                type="number"
                placeholder="e.g. 25"
                value={formData.maximumTerm}
                onChange={handleChange}
                error={errors.maximumTerm}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Minimum Age Requirement"
                id="minimumAge"
                name="minimumAge"
                type="number"
                placeholder="e.g. 18"
                value={formData.minimumAge}
                onChange={handleChange}
                error={errors.minimumAge}
                required
              />

              <FormInput
                label="Maximum Age Requirement"
                id="maximumAge"
                name="maximumAge"
                type="number"
                placeholder="e.g. 60"
                value={formData.maximumAge}
                onChange={handleChange}
                error={errors.maximumAge}
                required
              />
            </div>

            <FormSelect
              label="Premium Payment Frequency"
              id="premiumType"
              name="premiumType"
              placeholder="Select payment frequency"
              value={formData.premiumType}
              onChange={handleChange}
              options={[
                { label: "ANNUAL", value: "ANNUAL" },
                { label: "ONE_TIME", value: "ONE_TIME" },
              ]}
              error={errors.premiumType}
              required
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800">
              <SecondaryButton
                onClick={() => navigate(-1)}
                disabled={loading}
                icon={FaArrowLeft}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                loading={loading}
                icon={FaPlusCircle}
              >
                Add Policy Plan
              </PrimaryButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default AddPolicyPlan;
