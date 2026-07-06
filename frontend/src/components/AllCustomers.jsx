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
import { getAllCustomers, deleteCustomer } from "../services/CustomerService";
import { getAllUsers, updateUserStatus } from "../services/userService";

const AllCustomers = () => {
  const role = localStorage.getItem("role");
  
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);

  // Modals state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [confirmData, setConfirmData] = useState(null); // { id, type } -- type is 'delete', 'activate', 'deactivate'
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const [custRes, usersRes] = await Promise.all([
        getAllCustomers(),
        getAllUsers().catch(() => []),
      ]);

      const mergedList = (custRes?.data || []).map((cust) => {
        // Find matching User record by email or mobile to read login status
        const matchedUser = (usersRes || []).find((u) => u.email === cust.email);
        return {
          ...cust,
          userId: matchedUser?.userId || null,
          active: matchedUser ? matchedUser.active : true, // login enabled/disabled
        };
      });

      setCustomers(mergedList);
      setUsers(usersRes || []);
    } catch (err) {
      toast.error("Failed to load customer profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, []);

  const handleDetailsClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleActionTrigger = (id, type) => {
    setConfirmData({ id, type });
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!confirmData) return;
    setSubmitting(true);
    try {
      const { id, type } = confirmData;
      if (type === "delete") {
        await deleteCustomer(id);
        toast.warning("Customer profile deleted successfully 🗑️");
      } else {
        // Toggle user status (activate / deactivate login)
        // Find the matched customer in our list to read their userId
        const customer = customers.find((c) => c.customerId === id);
        if (!customer || !customer.userId) {
          throw new Error("No user login mapped to this customer profile");
        }
        const activeState = type === "activate";
        await updateUserStatus(customer.userId, activeState);
        toast.success(`Customer login ${activeState ? "activated" : "deactivated"} successfully ✨`);
      }
      setIsConfirmOpen(false);
      loadCustomerData();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to perform action");
    } finally {
      setSubmitting(false);
    }
  };

  // Search & Filtering
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.mobileNumber.includes(searchTerm);
    
    const activeString = String(cust.active);
    const matchesStatus =
      selectedStatus === "" ||
      (selectedStatus === "active" && activeString === "true") ||
      (selectedStatus === "inactive" && activeString === "false");

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / size);
  const paginatedCustomers = filteredCustomers.slice(page * size, (page + 1) * size);

  return (
    <PageLayout>
      <PageHeader
        title="Customer Directory"
        subtitle="Manage customer profiles, check nominee logs, and toggle access states."
      />

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, mobile..."
            onClear={() => setSearchTerm("")}
          />
          <FilterDropdown
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { label: "All Login Statuses", value: "" },
              { label: "Active Login Only", value: "active" },
              { label: "Suspended Login Only", value: "inactive" },
            ]}
            label="Login Status"
          />
        </div>
      </GlassCard>

      {/* Grid List */}
      <GlassCard padding={false}>
        <DataTable>
          <TableHeader headers={["Customer ID", "Full Name", "Email", "Mobile", "Nominee", "Status", "Actions"]} />
          <tbody>
            {loading ? (
              <TableSkeleton rows={size} cols={7} />
            ) : paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((cust) => (
                <TableRow key={cust.customerId}>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white">
                    #{cust.customerId}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-800 dark:text-white">
                    {cust.fullName}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    {cust.email}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    {cust.mobileNumber}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
                    {cust.nomineeName} ({cust.nomineeRelation})
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    <StatusBadge status={cust.active} />
                  </td>
                  <td className="px-6 py-4">
                    <ActionButtons
                      onDetails={() => handleDetailsClick(cust)}
                      onDelete={role === "ADMIN" ? () => handleActionTrigger(cust.customerId, "delete") : null}
                      onActivate={role === "ADMIN" && !cust.active ? () => handleActionTrigger(cust.customerId, "activate") : null}
                      onDeactivate={role === "ADMIN" && cust.active ? () => handleActionTrigger(cust.customerId, "deactivate") : null}
                    />
                  </td>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs font-semibold text-slate-400">
                  No matching customer profiles found.
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
        title="Customer Profile Details"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Customer ID</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">#{selectedCustomer.customerId}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Full Name</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedCustomer.fullName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{selectedCustomer.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Mobile Number</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{selectedCustomer.mobileNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">State</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{selectedCustomer.state}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">City</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{selectedCustomer.city}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Date of Birth</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{selectedCustomer.dateOfBirth}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Pin Code</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{selectedCustomer.pinCode}</p>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Residential Address</span>
              <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {selectedCustomer.address}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-blue-50/20 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800/80 p-3 rounded-lg">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Nominee Name</span>
                <p className="text-xs text-slate-800 dark:text-white font-bold">{selectedCustomer.nomineeName}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Nominee Relation</span>
                <p className="text-xs text-slate-800 dark:text-white font-bold">{selectedCustomer.nomineeRelation}</p>
              </div>
            </div>
          </div>
        )}
      </DetailsModal>

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        isDanger={confirmData?.type === "delete" || confirmData?.type === "deactivate"}
        title={
          confirmData?.type === "delete"
            ? "Remove Customer Record"
            : confirmData?.type === "deactivate"
            ? "Deactivate User Login"
            : "Activate User Login"
        }
        message={
          confirmData?.type === "delete"
            ? "Are you sure you want to permanently delete this customer's profile? This action will remove all address and nominee data, but will not delete their primary user login record."
            : confirmData?.type === "deactivate"
            ? "Are you sure you want to suspend this customer's login? The customer will no longer be able to log in to access their policies or file claims."
            : "Are you sure you want to reactivate this customer's login? The customer will immediately regain access to their portal."
        }
        confirmLabel={
          confirmData?.type === "delete"
            ? "Delete Profile"
            : confirmData?.type === "deactivate"
            ? "Suspend"
            : "Activate"
        }
        loading={submitting}
      />
    </PageLayout>
  );
};

export default AllCustomers;
