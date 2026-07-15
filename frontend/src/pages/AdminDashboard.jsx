import React, { useState, useEffect } from "react";
import Product from "../components/tables/Product";
import GetAllUser from "../components/tables/GetAllUser";
import GetAllCustomer from "../components/tables/GetAllCustomer";
import { getAllCustomers } from "../services/CustomerService";
import { getAllUsers } from "../services/userService";
import { getAllProduct } from "../services/ProductService";
import { getAllClaims } from "../services/claimService";
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  FileCheck, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Clock
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay }) => (
  <motion.div 
    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -4 }}
  >
    <div className="space-y-1.5">
      <h3 className="text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-wider uppercase">{title}</h3>
      <p className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{value}</p>
      {subtitle && <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{subtitle}</span>}
    </div>
    <div className={`p-3.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dynamic stats state
  const [stats, setStats] = useState({
    customers: 0,
    agents: 0,
    products: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    underProcessClaims: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Run fetches in parallel for efficiency
      const [customersRes, usersRes, productsRes, claimsRes] = await Promise.all([
        getAllCustomers().catch(() => ({ data: [] })),
        getAllUsers().catch(() => []),
        getAllProduct().catch(() => ({ content: [] })),
        getAllClaims(0, 100).catch(() => ({ content: [] }))
      ]);

      const customersCount = customersRes.data?.length || 0;
      const agentsCount = usersRes.filter(u => u.role === "AGENT").length || 0;
      const productsCount = productsRes.content?.length || 0;
      
      const claimsList = claimsRes.content || [];
      const pending = claimsList.filter(c => c.claimStatus === "RECOMMENDED_FOR_APPROVAL" || c.claimStatus === "RECOMMENDED_FOR_REJECTION").length;
      const approved = claimsList.filter(c => c.claimStatus === "APPROVED").length;
      const rejected = claimsList.filter(c => c.claimStatus === "REJECTED").length;
      const underProcess = claimsList.filter(c => c.claimStatus === "UNDER_PROCESS" || c.claimStatus === "SUBMITTED").length;

      setStats({
        customers: customersCount,
        agents: agentsCount,
        products: productsCount,
        pendingClaims: pending,
        approvedClaims: approved,
        rejectedClaims: rejected,
        underProcessClaims: underProcess
      });
    } catch (error) {
      console.error("Error loading dashboard statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Claims Recharts Data Mapping
  const chartData = [
    { name: "Approved", value: stats.approvedClaims, color: "#10b981" },
    { name: "Pending Review", value: stats.underProcessClaims, color: "#eab308" },
    { name: "Rec. for Action", value: stats.pendingClaims, color: "#3b82f6" },
    { name: "Rejected", value: stats.rejectedClaims, color: "#ef4444" },
  ];

  const totalClaims = stats.approvedClaims + stats.underProcessClaims + stats.pendingClaims + stats.rejectedClaims;

  return (
    <div className="space-y-8">
      {/* HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Monitor policies, claims queue, agents, and system operations.
          </p>
        </div>
        
        {/* Dynamic System Status Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">System Live</span>
        </div>
      </div>

      {/* DASHBOARD TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
        {[
          { id: "overview", label: "System Overview" },
          { id: "products", label: "Insurance Products" },
          { id: "customers", label: "Customers Directory" },
          { id: "agents", label: "Agents Registry" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3.5 font-semibold text-sm border-b-2 transition-all duration-200 whitespace-nowrap -mb-px
            ${activeTab === tab.id 
              ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500" 
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* COUNTERS STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard 
                  title="Total Customers" 
                  value={loading ? "..." : stats.customers} 
                  subtitle="Registered Policyholders"
                  icon={Users} 
                  color="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                  delay={0.05}
                />
                <StatCard 
                  title="Active Agents" 
                  value={loading ? "..." : stats.agents} 
                  subtitle="Authorized Representatives"
                  icon={UserCheck} 
                  color="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                  delay={0.1}
                />
                <StatCard 
                  title="Insurance Products" 
                  value={loading ? "..." : stats.products} 
                  subtitle="Available Categories"
                  icon={Briefcase} 
                  color="bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                  delay={0.15}
                />
                <StatCard 
                  title="Action Required Claims" 
                  value={loading ? "..." : stats.pendingClaims} 
                  subtitle="Pending Admin Decision"
                  icon={FileCheck} 
                  color="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                  delay={0.2}
                />
              </div>

              {/* ANALYTICS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recharts Claims Volume Card */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-800 dark:text-white">Claims Audit Summary</h2>
                      <p className="text-xs text-slate-400">Distribution of claims submitted across the portal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-800 dark:text-white">{loading ? "..." : totalClaims}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Handled</span>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    {loading ? (
                      <div className="h-full flex items-center justify-center text-slate-400 animate-pulse text-sm">
                        Calculating Metrics...
                      </div>
                    ) : totalClaims > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === "light" ? "#f1f5f9" : "#334155/30"} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip 
                            cursor={{ fill: "rgba(148, 163, 184, 0.05)" }}
                            contentStyle={{ 
                              background: "rgba(15, 23, 42, 0.9)", 
                              borderRadius: "12px", 
                              color: "#fff",
                              border: "none",
                              fontSize: "12px"
                            }} 
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={45}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        No Claims Logged in the System
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Claims Tasks Check Card */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-slate-800 dark:text-white">Active Audit Tasks</h2>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/10">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Clock size={16} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Pending Admin Audit</p>
                          <span className="text-[10px] text-slate-400">{stats.pendingClaims} claims await final approval/rejection</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-100/30 dark:border-yellow-900/10">
                        <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg"><AlertCircle size={16} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Under Agent Process</p>
                          <span className="text-[10px] text-slate-400">{stats.underProcessClaims} claims currently under evaluation</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/30 dark:border-emerald-900/10">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCircle2 size={16} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Approved Logs</p>
                          <span className="text-[10px] text-slate-400">{stats.approvedClaims} claims successfully processed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 text-center space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500">
                      <TrendingUp size={14} className="text-blue-500" />
                      <span>Action Items Rate</span>
                    </div>
                    <p className="text-2xl font-black text-slate-700 dark:text-slate-300">
                      {totalClaims > 0 ? Math.round((stats.pendingClaims / totalClaims) * 100) : 0}%
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <Product />
            </div>
          )}

          {activeTab === "customers" && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <GetAllCustomer />
            </div>
          )}

          {activeTab === "agents" && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <GetAllUser />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;