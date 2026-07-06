import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPaperPlane, FaArrowLeft, FaInbox } from "react-icons/fa";
import PageLayout from "./common/PageLayout";
import PageHeader from "./common/PageHeader";
import FormInput from "./common/FormInput";
import FormSelect from "./common/FormSelect";
import FormTextarea from "./common/FormTextarea";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import GlassCard from "./common/GlassCard";
import LoadingSpinner from "./common/LoadingSpinner";
import formatCurrency from "../utils/formatCurrency";
import { getMyPolicies } from "../services/PolicyService";
import { submitClaim } from "../services/claimService";

const SubmitClaim = () => {
  const navigate = useNavigate();
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [policies, setPolicies] = useState([]);

  const [formData, setFormData] = useState({
    policyId: "",
    claimAmount: "",
    claimReason: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const list = await getMyPolicies();
        // Keep active policies only
        setPolicies((list || []).filter((p) => p.active));
      } catch (err) {
        toast.error("Failed to load your policy records");
      } finally {
        setLoadingPolicies(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedPolicy = policies.find((p) => String(p.policyId) === formData.policyId);

    const valErrors = {};
    if (!formData.policyId) valErrors.policyId = "Please select a policy";
    if (!formData.claimAmount || Number(formData.claimAmount) <= 0) {
      valErrors.claimAmount = "Enter a valid claim amount";
    } else if (selectedPolicy && Number(formData.claimAmount) > selectedPolicy.coverageAmount) {
      valErrors.claimAmount = `Claim amount cannot exceed policy coverage limit of ${formatCurrency(selectedPolicy.coverageAmount)}`;
    }
    if (!formData.claimReason.trim()) valErrors.claimReason = "Claim reason is required";

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setSubmitting(true);
    try {
      await submitClaim(Number(formData.policyId), {
        claimAmount: Number(formData.claimAmount),
        claimReason: formData.claimReason,
      });

      toast.success("Insurance claim submitted successfully! 📄");
      navigate("/viewallclaim");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPolicies) return <LoadingSpinner fullPage message="Fetching coverage details..." />;

  const policyOptions = policies.map((p) => ({
    label: `Policy #${p.policyId} - ${p.planName || "Plan"} (Max Coverage: ${formatCurrency(p.coverageAmount)})`,
    value: p.policyId,
  }));

  return (
    <PageLayout>
      <PageHeader
        title="File Claim Request"
        subtitle="Submit documentation details and request coverage payout."
      />

      <div className="flex justify-center mt-2">
        {policies.length > 0 ? (
          <GlassCard hoverable={false} className="w-full max-w-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormSelect
                label="Choose Active Policy"
                id="policyId"
                name="policyId"
                placeholder="Select coverage policy ID"
                value={formData.policyId}
                onChange={handleChange}
                options={policyOptions}
                error={errors.policyId}
                required
              />

              <FormInput
                label="Claim Amount Request"
                id="claimAmount"
                name="claimAmount"
                type="number"
                placeholder="₹ Claim amount"
                value={formData.claimAmount}
                onChange={handleChange}
                error={errors.claimAmount}
                required
              />

              <FormTextarea
                label="Explanation & Reason"
                id="claimReason"
                name="claimReason"
                placeholder="Describe reason for claim request in detail..."
                value={formData.claimReason}
                onChange={handleChange}
                error={errors.claimReason}
                required
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800">
                <SecondaryButton
                  onClick={() => navigate("/viewallclaim")}
                  disabled={submitting}
                  icon={FaArrowLeft}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  type="submit"
                  loading={submitting}
                  icon={FaPaperPlane}
                >
                  Submit Claim Request
                </PrimaryButton>
              </div>
            </form>
          </GlassCard>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center text-slate-400 max-w-md">
            <FaInbox className="w-12 h-12 mb-4" />
            <p className="text-sm font-semibold mb-2">No active policies found to file claims under.</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              You must purchase a coverage plan and pay the initial premium to establish active policies before filing claims.
            </p>
            <SecondaryButton onClick={() => navigate("/customerdashboard")} icon={FaArrowLeft}>
              Back to Dashboard
            </SecondaryButton>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SubmitClaim;
