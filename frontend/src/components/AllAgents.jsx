import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLayout from "./common/PageLayout";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import TableHeader from "./common/TableHeader";
import TableRow from "./common/TableRow";
import StatusBadge from "./common/StatusBadge";
import ActionButtons from "./common/ActionButtons";
import SearchBar from "./common/SearchBar";
import FilterDropdown from "./common/FilterDropdown";
import Pagination from "./common/Pagination";
import LoadingSpinner, { TableSkeleton } from "./common/LoadingSpinner";
import DetailsModal from "./common/DetailsModal";
import ConfirmationModal from "./common/ConfirmationModal";
import GlassCard from "./common/GlassCard";
import { getAllAgents, updateAgentActiveStatus } from "../services/AgentService";

const AllAgents = () => {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  
  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);

  // Modals state
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [confirmData, setConfirmData] = useState(null); // { id, active }
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const data = await getAllAgents();
      setAgents(data || []);
    } catch (err) {
      toast.error("Failed to load agents list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleDetailsClick = (agent) => {
    setSelectedAgent(agent);
    setIsDetailsOpen(true);
  };

  const handleToggleClick = (userId, activeState) => {
    setConfirmData({ id: userId, active: activeState });
    setIsConfirmOpen(true);
  };

  const handleToggleConfirm = async () => {
    if (!confirmData) return;
    setSubmitting(true);
    try {
      const { id, active } = confirmData;
      await updateAgentActiveStatus(id, active);
      toast.success(`Agent login status ${active ? "activated" : "deactivated"} successfully ✨`);
      setIsConfirmOpen(false);
      loadAgents();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to toggle agent active status");
    } finally {
      setSubmitting(false);
    }
  };

  // Search & Filters
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.mobileNumber.includes(searchTerm);

    const activeString = String(agent.active);
    const matchesStatus =
      selectedStatus === "" ||
      (selectedStatus === "active" && activeString === "true") ||
      (selectedStatus === "inactive" && activeString === "false");

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAgents.length / size);
  const paginatedAgents = filteredAgents.slice(page * size, (page + 1) * size);

  return (
    <PageLayout>
      <PageHeader
        title="Agent Directory"
        subtitle="Manage agent credentials, approve applications, or suspend access keys."
      />

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search agents by name, email, mobile..."
            onClear={() => setSearchTerm("")}
          />
          <FilterDropdown
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { label: "All Active Statuses", value: "" },
              { label: "Active Accounts Only", value: "active" },
              { label: "Suspended Accounts Only", value: "inactive" },
            ]}
            label="Agent Active Status"
          />
        </div>
      </GlassCard>

      {/* Agent Grid */}
      <GlassCard padding={false}>
        <DataTable>
          <TableHeader headers={["Agent ID", "Full Name", "Email", "Mobile", "Status", "Actions"]} />
          <tbody>
            {loading ? (
              <TableSkeleton rows={size} cols={6} />
            ) : paginatedAgents.length > 0 ? (
              paginatedAgents.map((agent) => (
                <TableRow key={agent.userId}>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white">
                    #{agent.userId}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-850 dark:text-white">
                    {agent.fullName}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    {agent.email}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    {agent.mobileNumber}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    <StatusBadge status={agent.active} />
                  </td>
                  <td className="px-6 py-4">
                    <ActionButtons
                      onDetails={() => handleDetailsClick(agent)}
                      onActivate={!agent.active ? () => handleToggleClick(agent.userId, true) : null}
                      onDeactivate={agent.active ? () => handleToggleClick(agent.userId, false) : null}
                    />
                  </td>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs font-semibold text-slate-400">
                  No matching agent profiles found.
                </td>
              </tr>
            )}
          </tbody>
        </DataTable>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          pageSize={size}
          onPageSizeChange={setSize}
        />
      </GlassCard>

      {/* Details Modal */}
      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Agent Credentials Specs"
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">User ID</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">#{selectedAgent.userId}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Full Name</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedAgent.fullName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                <p className="text-xs text-slate-700 dark:text-slate-350 font-semibold">{selectedAgent.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Mobile Number</span>
                <p className="text-xs text-slate-700 dark:text-slate-350 font-semibold">{selectedAgent.mobileNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Role</span>
                <p className="text-xs text-slate-700 dark:text-slate-350 font-semibold">{selectedAgent.role}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Verification Status</span>
                <p className="text-xs text-emerald-600 font-bold">Email & Mobile Verified</p>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Active status</span>
              <div>
                <StatusBadge status={selectedAgent.active} />
              </div>
            </div>
          </div>
        )}
      </DetailsModal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleToggleConfirm}
        isDanger={!confirmData?.active}
        title={confirmData?.active ? "Reactivate Agent" : "Suspend Agent"}
        message={
          confirmData?.active
            ? "Are you sure you want to reactivate this agent's account? They will immediately regain access to their workspace dashboard."
            : "Are you sure you want to suspend this agent's account? They will be locked out and won't be able to access their assigned claims review queues."
        }
        confirmLabel={confirmData?.active ? "Reactivate" : "Suspend Agent"}
        loading={submitting}
      />
    </PageLayout>
  );
};

export default AllAgents;
