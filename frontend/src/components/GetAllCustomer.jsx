import React, { useEffect, useState, useMemo } from "react";
import { getAllCustomers } from "../services/CustomerService";
import { toast } from "react-toastify";
import { Search, MapPin, Mail, User, Shield, ChevronLeft, ChevronRight, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GetAllCustomer = () => {
  const [cusData, setCusData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getAllCustomer = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCusData(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed To Load Customers ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCustomer();
  }, []);

  // Extract unique States and Cities for filters
  const uniqueStates = useMemo(() => {
    const states = cusData.map((c) => c.state).filter(Boolean);
    return [...new Set(states)];
  }, [cusData]);

  const uniqueCities = useMemo(() => {
    const filtered = selectedState
      ? cusData.filter((c) => c.state === selectedState)
      : cusData;
    const cities = filtered.map((c) => c.city).filter(Boolean);
    return [...new Set(cities)];
  }, [cusData, selectedState]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState, selectedCity]);

  // Client-side Filter logic
  const filteredCustomers = useMemo(() => {
    return cusData.filter((customer) => {
      const matchesSearch = 
        customer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesState = selectedState ? customer.state === selectedState : true;
      const matchesCity = selectedCity ? customer.city === selectedCity : true;

      return matchesSearch && matchesState && matchesCity;
    });
  }, [cusData, searchQuery, selectedState, selectedCity]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-700 dark:text-slate-200">
      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* State Filter */}
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          }}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="">All States</option>
          {uniqueStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* City Filter */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          disabled={!selectedState}
        >
          <option value="">All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* CUSTOMER CARDS GRID */}
      {paginatedCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedCustomers.map((ele) => (
            <motion.div
              key={ele.customerId}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              whileHover={{ y: -3 }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase">
                    Customer
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: #{ele.customerId}
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
                    <MapPin size={13} className="text-slate-350 dark:text-slate-500" />
                    <span>
                      {ele.city || "N/A"}, {ele.state || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(ele)}
                className="mt-5 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800/50 dark:hover:bg-blue-600 dark:text-slate-200 text-slate-700 text-xs font-semibold tracking-wide transition-all active:scale-98"
              >
                <Info size={14} />
                View Full Details
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <User size={32} className="mx-auto text-slate-300 dark:text-slate-650 mb-2" />
          <h3 className="text-base font-bold text-slate-600 dark:text-slate-450">No Customers Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search queries or filters.</p>
        </div>
      )}

      {/* PAGINATION CONTROL BAR */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <p className="text-xs text-slate-450">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{paginatedCustomers.length}</span> of <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredCustomers.length}</span> customers
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

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-800 dark:text-white"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>

              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase">
                  Profile Details
                </span>
                <h2 className="text-xl font-extrabold mt-3 text-slate-900 dark:text-white">
                  {selectedCustomer.fullName}
                </h2>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-b border-slate-100 dark:border-slate-800/80 py-5 text-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Customer ID</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-250">#{selectedCustomer.customerId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Email Address</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-250 truncate block">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Date of Birth</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-250">{selectedCustomer.dateOfBirth || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Nominee Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-250">{selectedCustomer.nomineeName || "N/A"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Nominee Relationship</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-250">{selectedCustomer.nomineeRelation || "N/A"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Street Address</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-250">{selectedCustomer.address || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">City & State</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-250">
                    {selectedCustomer.city}, {selectedCustomer.state}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Pincode</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-250">{selectedCustomer.pinCode || "N/A"}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition active:scale-97"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GetAllCustomer;
