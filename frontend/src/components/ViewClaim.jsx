import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaInbox, FaFolderOpen, FaArrowLeft, FaPlus, FaCheck, FaBan, FaUpload } from "react-icons/fa";
import PageLayout from "./common/PageLayout";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import TableHeader from "./common/TableHeader";
import TableRow from "./common/TableRow";
import StatusBadge from "./common/StatusBadge";
import SearchBar from "./common/SearchBar";
import FilterDropdown from "./common/FilterDropdown";
import Pagination from "./common/Pagination";
import LoadingSpinner, { TableSkeleton } from "./common/LoadingSpinner";
import DetailsModal from "./common/DetailsModal";
import ConfirmationModal from "./common/ConfirmationModal";
import GlassCard from "./common/GlassCard";
import FormTextarea from "./common/FormTextarea";
import formatCurrency from "../utils/formatCurrency";
import {
  getAllClaims,
  getClaimsByCustomer,
  getSubmittedClaims,
  withdrawClaim,
  reviewClaim,
  recommendClaimApproval,
  recommendClaimRejection,
  approveClaim,
  rejectClaim,
  uploadClaimDocuments,
  getClaimDocuments,
} from "../services/claimService";
import { checkCustomerProfileExists, getAllCustomers } from "../services/CustomerService";

const ViewClaim = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  // Pagination & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Modal Decision logs
  const [activeClaim, setActiveClaim] = useState(null);
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);
  const [decisionRemarks, setDecisionRemarks] = useState("");
  const [decisionType, setDecisionType] = useState(""); // 'recommend-approve', 'recommend-reject', 'approve', 'reject'
  const [submitting, setSubmitting] = useState(false);

  // Document Uploads
  const [uploadClaimId, setUploadClaimId] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [docsList, setDocsList] = useState([]);

  const loadClaimsData = async () => {
    setLoading(true);
    try {
      if (role === "CUSTOMER") {
        const exists = await checkCustomerProfileExists();
        if (exists) {
          // Fetch customer's own ID
          const customersRes = await getAllCustomers();
          const email = localStorage.getItem("userName");
          const cust = (customersRes?.data || []).find((c) => c.email === email);
          if (cust) {
            setCustomerId(cust.customerId);
            const pageClaims = await getClaimsByCustomer(cust.customerId, page, size);
            setClaims(pageClaims.content || []);
            setTotalPages(pageClaims.totalPages || 1);
          }
        }
      } else if (role === "AGENT") {
        const claimsList = await getSubmittedClaims();
        setClaims(claimsList || []);
        setTotalPages(1);
      } else {
        const pageClaims = await getAllClaims(page, size);
        setClaims(pageClaims.content || []);
        setTotalPages(pageClaims.totalPages || 1);
      }
    } catch (err) {
      toast.error("Failed to load claims database records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaimsData();
  }, [page, size]);

  const handleWithdraw = async (claimId) => {
    if (!window.confirm("Are you sure you want to withdraw this claim request?")) return;
    try {
      await withdrawClaim(claimId);
      toast.warning("Claim withdrawn successfully 🚀");
      loadClaimsData();
    } catch (err) {
      toast.error("Failed to withdraw claim");
    }
  };

  const handleProcessClick = (claim, type) => {
    setActiveClaim(claim);
    setDecisionType(type);
    setDecisionRemarks("");
    setIsDecisionOpen(true);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!decisionRemarks.trim()) {
      toast.error("Please enter decision remarks");
      return;
    }

    setSubmitting(true);
    try {
      if (decisionType === "start-review") {
        await reviewClaim(activeClaim.claimId, { remarks: decisionRemarks });
        toast.success("Claim status updated to Under Review 🔍");
      } else if (decisionType === "recommend-approve") {
        await recommendClaimApproval(activeClaim.claimId, { remarks: decisionRemarks, approve: true });
        toast.success("Claim recommended for approval ✨");
      } else if (decisionType === "recommend-reject") {
        await recommendClaimRejection(activeClaim.claimId, { remarks: decisionRemarks, approve: false });
        toast.warning("Claim recommended for rejection ⛔");
      } else if (decisionType === "approve") {
        await approveClaim(activeClaim.claimId, { remarks: decisionRemarks, approve: true });
        toast.success("Claim approved successfully ✨");
      } else if (decisionType === "reject") {
        await rejectClaim(activeClaim.claimId, { remarks: decisionRemarks, approve: false });
        toast.error("Claim rejected successfully ⛔");
      }
      setIsDecisionOpen(false);
      loadClaimsData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit claim decision");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocsClick = async (claimId) => {
    setUploadClaimId(claimId);
    setUploadFiles([]);
    setIsUploadOpen(true);
    try {
      const docs = await getClaimDocuments(claimId);
      setDocsList(docs || []);
    } catch (err) {
      setDocsList([]);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (uploadFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append("files", uploadFiles[i]);
    }

    setSubmitting(true);
    try {
      await uploadClaimDocuments(uploadClaimId, formData);
      toast.success("Documents uploaded successfully 📄");
      setIsUploadOpen(false);
      loadClaimsData();
    } catch (err) {
      toast.error("Failed to upload claim documents");
    } finally {
      setSubmitting(false);
    }
  };

  // Search & Filter
  const filteredClaims = claims.filter((c) => {
    const matchesSearch =
      c.claimReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c.claimId).includes(searchTerm);
    const matchesStatus = selectedStatus === "" || c.claimStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getModalTitle = () => {
    switch (decisionType) {
      case "start-review": return "Start Claim Review";
      case "recommend-approve": return "Recommend Claim Approval";
      case "recommend-reject": return "Recommend Claim Rejection";
      case "approve": return "Approve Claim Request";
      case "reject": return "Reject Claim Request";
      default: return "Submit Claim Review Decision";
    }
  };

  const headers = [
    "Claim ID",
    "Policy ID",
    "Reason",
    "Amount Requested",
    "Status",
    "Docs",
    "Actions",
  ];

  return (
    <PageLayout>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Claims Portfolio"
          subtitle="Submit new claim requests, authorize reviews, or finalize settlements."
        />

        {role === "CUSTOMER" && customerId && (
          <button
            type="button"
            onClick={() => navigate("/submitclaim")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <FaPlus className="w-3 h-3" /> File Claim
          </button>
        )}
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, claim reason..."
            onClear={() => setSearchTerm("")}
          />
          <FilterDropdown
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { label: "All Claim Statuses", value: "" },
              { label: "Submitted", value: "SUBMITTED" },
              { label: "Under Review", value: "UNDER_REVIEW" },
              { label: "Recommended Approved", value: "RECOMMENDED_FOR_APPROVAL" },
              { label: "Recommended Rejected", value: "RECOMMENDED_FOR_REJECTION" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
              { label: "Withdrawn", value: "WITHDRAWN" },
            ]}
            label="Claim Status"
          />
        </div>
      </GlassCard>

      {/* Grid */}
      <GlassCard padding={false}>
        <DataTable>
          <TableHeader headers={headers} />
          <tbody>
            {loading ? (
              <TableSkeleton rows={size} cols={7} />
            ) : filteredClaims.length > 0 ? (
              filteredClaims.map((claim) => (
                <TableRow key={claim.claimId}>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white">
                    #{claim.claimId}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    Policy #{claim.policyId}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                    {claim.claimReason}
                  </td>
                  <td className="px-6 py-4 text-xs font-extrabold text-slate-800 dark:text-white">
                    {formatCurrency(claim.claimAmount)}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    <StatusBadge status={claim.claimStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleDocsClick(claim.claimId)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Files
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {role === "CUSTOMER" && claim.claimStatus === "SUBMITTED" && (
                        <button
                          type="button"
                          onClick={() => handleWithdraw(claim.claimId)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all"
                        >
                          Withdraw
                        </button>
                      )}

                      {role === "AGENT" && claim.claimStatus === "SUBMITTED" && (
                        <button
                          type="button"
                          onClick={() => handleProcessClick(claim, "start-review")}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold"
                        >
                          Start Review
                        </button>
                      )}

                      {role === "AGENT" && claim.claimStatus === "UNDER_REVIEW" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleProcessClick(claim, "recommend-approve")}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold"
                          >
                            Recommend Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProcessClick(claim, "recommend-reject")}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold"
                          >
                            Recommend Reject
                          </button>
                        </>
                      )}

                      {role === "ADMIN" && claim.claimStatus === "RECOMMENDED_FOR_APPROVAL" && (
                        <button
                          type="button"
                          onClick={() => handleProcessClick(claim, "approve")}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold"
                        >
                          Approve
                        </button>
                      )}

                      {role === "ADMIN" && claim.claimStatus === "RECOMMENDED_FOR_REJECTION" && (
                        <button
                          type="button"
                          onClick={() => handleProcessClick(claim, "reject")}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs font-semibold text-slate-400">
                  No claims submitted matching search specs.
                </td>
              </tr>
            )}
          </tbody>
        </DataTable>

        {role !== "AGENT" && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={size}
            onPageSizeChange={setSize}
          />
        )}
      </GlassCard>

      {/* Decision Remarks Modal */}
      <DetailsModal
        isOpen={isDecisionOpen}
        onClose={() => setIsDecisionOpen(false)}
        title={getModalTitle()}
      >
        <form onSubmit={handleDecisionSubmit} className="space-y-4">
          <FormTextarea
            label="Decision Remarks / Reason"
            id="remarks"
            name="remarks"
            placeholder="Type your verification notes or remarks for final review..."
            value={decisionRemarks}
            onChange={(e) => setDecisionRemarks(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-805">
            <SecondaryButton onClick={() => setIsDecisionOpen(false)} disabled={submitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" loading={submitting}>
              Submit Decision
            </PrimaryButton>
          </div>
        </form>
      </DetailsModal>

      {/* Documents Modal */}
      <DetailsModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title={`Claim Documents (Claim #${uploadClaimId})`}
      >
        <div className="space-y-5">
          {docsList.length > 0 ? (
            <div className="space-y-2 bg-slate-50/50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-805 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Attached Files</span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {docsList.map((doc, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{doc.documentName}</span>
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No documents uploaded for this claim yet.</p>
          )}

          {role === "CUSTOMER" && (
            <form onSubmit={handleFileUpload} className="space-y-4 border-t border-slate-200/50 dark:border-slate-805 pt-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Upload Coverage Proof Documents
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setUploadFiles(e.target.files)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 dark:file:bg-slate-800 dark:file:text-slate-200 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <SecondaryButton onClick={() => setIsUploadOpen(false)} disabled={submitting}>
                  Close
                </SecondaryButton>
                <PrimaryButton type="submit" loading={submitting} icon={FaUpload}>
                  Upload Proof
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </DetailsModal>
    </PageLayout>
  );
};

export default ViewClaim;
