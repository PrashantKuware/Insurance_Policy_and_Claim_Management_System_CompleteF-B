import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaInbox, FaFolderOpen, FaClock, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import PageLayout from "../components/common/PageLayout";
import PageHeader from "../components/common/PageHeader";
import StatsCard from "../components/common/StatsCard";
import DataTable from "../components/common/DataTable";
import TableHeader from "../components/common/TableHeader";
import TableRow from "../components/common/TableRow";
import StatusBadge from "../components/common/StatusBadge";
import GlassCard from "../components/common/GlassCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import formatCurrency from "../utils/formatCurrency";
import { getSubmittedClaims } from "../services/claimService";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submittedClaims, setSubmittedClaims] = useState([]);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const claims = await getSubmittedClaims();
        setSubmittedClaims(claims || []);
      } catch (err) {
        toast.error("Failed to load agent claims dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, []);

  const pendingClaimsCount = submittedClaims.filter((c) => c.claimStatus === "SUBMITTED" || c.claimStatus === "UNDER_REVIEW").length;
  const processedClaimsCount = submittedClaims.filter((c) => c.claimStatus !== "SUBMITTED" && c.claimStatus !== "UNDER_REVIEW").length;

  if (loading) return <LoadingSpinner fullPage message="Fetching claim registries..." />;

  return (
    <PageLayout>
      <PageHeader
        title="Agent Workspace"
        subtitle="Review customer claim request forms and submit recommendations."
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Submitted Queue"
          value={pendingClaimsCount}
          icon={FaClock}
          description="Waiting for agent review"
        />
        <StatsCard
          title="Reviewed Claims"
          value={processedClaimsCount}
          icon={FaCheckCircle}
          description="Processed recommendation"
        />
        <StatsCard
          title="Total Assigned"
          value={submittedClaims.length}
          icon={FaFolderOpen}
          description="Total claims in portfolio"
        />
      </div>

      {/* Claims Queue Card */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Pending Claims Review Queue
          </h3>
          <button
            type="button"
            onClick={() => navigate("/viewallclaim")}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Review Full Queue <FaArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>

        {submittedClaims.length > 0 ? (
          <DataTable>
            <TableHeader headers={["Claim ID", "Policy ID", "Description", "Amount", "Status", "Action"]} />
            <tbody>
              {submittedClaims.map((claim) => (
                <TableRow key={claim.claimId}>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white">
                    #{claim.claimId}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    Policy #{claim.policyId}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[150px] truncate">
                    {claim.claimReason}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white">
                    {formatCurrency(claim.claimAmount)}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    <StatusBadge status={claim.claimStatus} />
                  </td>
                  <td className="px-6 py-4 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => navigate(`/viewallclaim`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      Process
                    </button>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
            <FaInbox className="w-8 h-8 mb-2" />
            <p className="text-xs font-semibold">All caught up! No claims waiting for review.</p>
          </div>
        )}
      </GlassCard>
    </PageLayout>
  );
};

export default AgentDashboard;
