import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUserTie, FaShieldAlt, FaFolderOpen, FaArrowRight, FaPlusCircle } from "react-icons/fa";
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
import { getAllCustomers } from "../services/CustomerService";
import { getAllAgents } from "../services/AgentService";
import { getAllProducts } from "../services/ProductService";
import { getAllClaims } from "../services/claimService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    customers: 0,
    agents: 0,
    products: 0,
    claims: 0,
  });

  const [recentClaims, setRecentClaims] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customersData, agentsData, productsData, claimsData] = await Promise.all([
          getAllCustomers().catch(() => ({ data: [] })),
          getAllAgents().catch(() => []),
          getAllProducts(0, 100).catch(() => ({ content: [] })),
          getAllClaims(0, 5).catch(() => ({ content: [] })),
        ]);

        setStats({
          customers: customersData?.data?.length || 0,
          agents: agentsData?.length || 0,
          products: productsData?.content?.length || 0,
          claims: claimsData?.totalElements || 0,
        });

        setRecentClaims(claimsData?.content || []);
      } catch (err) {
        toast.error("Failed to load some dashboard details");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner fullPage message="Aggregating metrics..." />;

  return (
    <PageLayout>
      <PageHeader
        title="Admin Control Center"
        subtitle="Manage configurations, verify users, and coordinate claims."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Customers"
          value={stats.customers}
          icon={FaUsers}
          description="Registered profiles in system"
        />
        <StatsCard
          title="Field Agents"
          value={stats.agents}
          icon={FaUserTie}
          description="Authorized active brokers"
        />
        <StatsCard
          title="Insurance Products"
          value={stats.products}
          icon={FaShieldAlt}
          description="Available coverage categories"
        />
        <StatsCard
          title="Submitted Claims"
          value={stats.claims}
          icon={FaFolderOpen}
          description="Total claims requested"
        />
      </div>

      {/* Quick Actions & Recent Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <GlassCard className="lg:col-span-1 flex flex-col justify-between p-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
              Quick Admin Actions
            </h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate("/addProduct")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800/80 transition-colors text-sm font-semibold text-left"
              >
                <span className="flex items-center gap-3">
                  <FaPlusCircle className="text-blue-500" /> Add Product Category
                </span>
                <FaArrowRight className="text-slate-400 w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/addagent")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800/80 transition-colors text-sm font-semibold text-left"
              >
                <span className="flex items-center gap-3">
                  <FaPlusCircle className="text-emerald-500" /> Create Agent Account
                </span>
                <FaArrowRight className="text-slate-400 w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/60 text-xs font-semibold text-slate-500">
            Select an option to navigate to the setup forms immediately.
          </div>
        </GlassCard>

        {/* Recent Claims Table Card */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Recent Claims Activity
            </h3>
            <button
              type="button"
              onClick={() => navigate("/viewallclaim")}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View Queue <FaArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>

          {recentClaims.length > 0 ? (
            <DataTable>
              <TableHeader headers={["Claim ID", "Policy ID", "Amount", "Status"]} />
              <tbody>
                {recentClaims.map((claim) => (
                  <TableRow key={claim.claimId}>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white">
                      #{claim.claimId}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Policy #{claim.policyId || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white">
                      {formatCurrency(claim.claimAmount)}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      <StatusBadge status={claim.claimStatus} />
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <div className="py-10 text-center text-xs font-semibold text-slate-400">
              No recent claims submitted.
            </div>
          )}
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
