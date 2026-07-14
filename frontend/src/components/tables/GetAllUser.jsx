import React, { useEffect, useState, useMemo } from "react";
import { getAllUsers } from "../../services/userService";
import { toast } from "react-toastify";
import { Search, Mail, Phone, ShieldCheck, ChevronLeft, ChevronRight, User } from "lucide-react";
import { motion } from "framer-motion";

const GetAllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed To Load Agents ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users to get AGENT role only
  const agents = useMemo(() => {
    return users.filter((user) => user.role === "AGENT");
  }, [users]);

  // Reset page when search or status filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  // Filter logic
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch = 
        agent.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.mobileNumber?.includes(searchQuery);

      const matchesStatus = 
        selectedStatus === "all" 
          ? true 
          : selectedStatus === "active" 
            ? agent.active === true 
            : agent.active === false;

      return matchesSearch && matchesStatus;
    });
  }, [agents, searchQuery, selectedStatus]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAgents, currentPage]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-700 dark:text-slate-200">
      {/* SEARCH AND FILTERS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search agent by name, email, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Status Dropdown Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="all">All Agents</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* AGENTS LIST CARDS */}
      {paginatedAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedAgents.map((ele) => (
            <motion.div
              key={ele.userId}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              whileHover={{ y: -3 }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                    Agent
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    UID: #{ele.userId}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-850 dark:text-white mb-2">
                  {ele.fullName}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-slate-350 dark:text-slate-500" />
                    <span className="truncate">{ele.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-slate-350 dark:text-slate-500" />
                    <span>{ele.mobileNumber || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Status</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    ele.active
                      ? "text-emerald-600 bg-emerald-50 dark:text-emerald-450 dark:bg-emerald-950/30"
                      : "text-rose-600 bg-rose-50 dark:text-rose-450 dark:bg-rose-950/30"
                  }`}
                >
                  {ele.active ? "Active" : "Inactive"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <User size={32} className="mx-auto text-slate-300 dark:text-slate-650 mb-2" />
          <h3 className="text-base font-bold text-slate-600 dark:text-slate-450">No Agents Found</h3>
          <p className="text-xs text-slate-400 mt-1">Adjust search parameters or selected filters.</p>
        </div>
      )}

      {/* PAGINATION PROGRESS BAR */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <p className="text-xs text-slate-450">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{paginatedAgents.length}</span> of <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredAgents.length}</span> agents
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-650 disabled:opacity-40 disabled:hover:bg-transparent hover:bg-slate-50 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold px-3 py-1 text-slate-650">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-650 disabled:opacity-40 disabled:hover:bg-transparent hover:bg-slate-50 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllUser;
