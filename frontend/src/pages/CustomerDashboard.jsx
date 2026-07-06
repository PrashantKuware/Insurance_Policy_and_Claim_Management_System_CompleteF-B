import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaShieldAlt, FaListAlt, FaArrowRight, FaCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import PageLayout from "../components/common/PageLayout";
import PageHeader from "../components/common/PageHeader";
import StatsCard from "../components/common/StatsCard";
import GlassCard from "../components/common/GlassCard";
import DataTable from "../components/common/DataTable";
import TableHeader from "../components/common/TableHeader";
import TableRow from "../components/common/TableRow";
import StatusBadge from "../components/common/StatusBadge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import formatCurrency from "../utils/formatCurrency";
import { getMyPolicies } from "../services/PolicyService";
import { getAllProducts } from "../services/ProductService";
import { checkCustomerProfileExists } from "../services/CustomerService";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCustomerDashboardData = async () => {
      try {
        // 1. Check profile existence
        const exists = await checkCustomerProfileExists();
        setHasProfile(exists);

        // 2. If profile exists, fetch policies
        if (exists) {
          const myPolicies = await getMyPolicies();
          setPolicies(myPolicies || []);
        }

        // 3. Fetch products
        const productsData = await getAllProducts(0, 100);
        const activeProducts = (productsData?.content || []).filter((p) => p.active);
        setProducts(activeProducts);
      } catch (err) {
        toast.error("Error loading customer dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDashboardData();
  }, []);

  if (loading) return <LoadingSpinner fullPage message="Configuring customer portal..." />;

  return (
    <PageLayout>
      <PageHeader
        title="Customer Dashboard"
        subtitle="Explore products, track claims, and manage your policy portfolio."
      />

      {/* Profile Check Warning */}
      {!hasProfile && (
        <GlassCard className="border-amber-300 dark:border-amber-950 bg-amber-50/50 dark:bg-amber-950/15 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
              Customer Profile Required
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
              You must register your profile information (address, nominee) before buying coverage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/addCustomer")}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all shrink-0"
          >
            <FaUserPlus /> Complete Profile
          </button>
        </GlassCard>
      )}

      {/* Summary Stats */}
      {hasProfile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatsCard
            title="My Active Policies"
            value={policies.filter((p) => p.policyStatus === "ACTIVE").length}
            icon={FaShieldAlt}
            description="Active coverage packages"
          />
          <StatsCard
            title="Total Premium Invested"
            value={formatCurrency(
              policies.reduce((sum, p) => sum + (p.totalPremiumPaid || 0), 0)
            )}
            icon={FaCreditCard}
            description="Total premium for registered policies"
          />
        </div>
      )}

      {/* Active Policies Table */}
      {hasProfile && (
        <GlassCard className="p-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
            My Active Insurance Policies
          </h3>
          {policies.length > 0 ? (
            <DataTable>
              <TableHeader
                headers={[
                  "Policy ID",
                  "Policy Number",
                  "Plan Name",
                  "Premium Paid",
                  "Status",
                  "Action",
                ]}
              />
              <tbody>
                {policies.map((p) => (
                  <TableRow key={p.policyId}>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white">
                      #{p.policyId}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                      {p.policyNumber}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-650 dark:text-slate-300">
                      {p.planName || "Standard Plan"}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white">
                      {formatCurrency(p.totalPremiumPaid)}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      <StatusBadge status={p.policyStatus} />
                    </td>
                    <td className="px-6 py-4 text-xs font-bold flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/viewallclaim`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        Claims
                      </button>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <div className="py-8 text-center text-xs font-semibold text-slate-400">
              No policy coverage active yet. Browse the catalog below to buy one!
            </div>
          )}
        </GlassCard>
      )}

      {/* Insurance Products Catalog */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pl-1">
          Insurance Products Catalog
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <GlassCard key={prod.productId} hoverable className="flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 rounded-full mb-3">
                  {prod.productType}
                </span>
                <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2">
                  {prod.productName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[50px]">
                  {prod.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-500 uppercase">
                  Available Now
                </span>
                <button
                  type="button"
                  disabled={!hasProfile}
                  onClick={() => navigate(`/viewallplan/${prod.productId}`)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50 disabled:pointer-events-none"
                >
                  View Plans <FaArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default CustomerDashboard;
