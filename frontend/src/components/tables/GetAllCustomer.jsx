import React, { useEffect, useState, useMemo } from "react";
import { getAllCustomers } from "../../services/CustomerService";
import { getAllUsers } from "../../services/userService";
import { getAllPolicy } from "../../services/PlanServices";
import { getAllProduct } from "../../services/ProductService";
import { getAllPolicies } from "../../services/policyService";
import { getClaimsByCustomer } from "../../services/claimService";
import { toast } from "react-toastify";
import { Search, MapPin, Mail, User, Shield, ChevronLeft, ChevronRight, X, Info, ShieldCheck, FileClock, Phone, Calendar, UserCheck, Activity, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GetAllCustomer = () => {
  const [cusData, setCusData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Directory lists for data correlation
  const [usersList, setUsersList] = useState([]);
  const [plansList, setPlansList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [policiesList, setPoliciesList] = useState([]);
  
  // Selected Customer detail states
  const [customerClaims, setCustomerClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile, policies, claims

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

  const loadDirectories = async () => {
    // Safely load each directory individually to prevent failure of one endpoint from blocking the others
    try {
      const users = await getAllUsers().catch(e => { console.error("Error loading users:", e); return []; });
      setUsersList(Array.isArray(users) ? users : []);
    } catch (e) {}

    try {
      const plans = await getAllPolicy().catch(e => { console.error("Error loading plans:", e); return []; });
      setPlansList(Array.isArray(plans) ? plans : []);
    } catch (e) {}

    try {
      const products = await getAllProduct(0, 1000).catch(e => { console.error("Error loading products:", e); return []; });
      const productsArr = Array.isArray(products) 
        ? products 
        : (products?.content && Array.isArray(products.content)) 
          ? products.content 
          : [];
      setProductsList(productsArr);
    } catch (e) {}

    try {
      const policies = await getAllPolicies(0, 1000).catch(e => { console.error("Error loading policies:", e); return []; });
      const policiesArr = Array.isArray(policies) 
        ? policies 
        : (policies?.content && Array.isArray(policies.content)) 
          ? policies.content 
          : [];
      setPoliciesList(policiesArr);
    } catch (e) {}
  };

  useEffect(() => {
    getAllCustomer();
    loadDirectories();
  }, []);

  // Extract unique States and Cities for filters
  const uniqueStates = useMemo(() => {
    if (!Array.isArray(cusData)) return [];
    const states = cusData.map((c) => c && c.state).filter(Boolean);
    return [...new Set(states)];
  }, [cusData]);

  const uniqueCities = useMemo(() => {
    if (!Array.isArray(cusData)) return [];
    const filtered = selectedState
      ? cusData.filter((c) => c && c.state === selectedState)
      : cusData;
    const cities = filtered.map((c) => c && c.city).filter(Boolean);
    return [...new Set(cities)];
  }, [cusData, selectedState]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState, selectedCity]);

  // Client-side Filter logic
  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(cusData)) return [];
    return cusData.filter((customer) => {
      if (!customer) return false;
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

  const handleOpenDetails = async (customer) => {
    if (!customer) return;
    setSelectedCustomer(customer);
    setActiveTab("profile");
    setCustomerClaims([]);
    try {
      setClaimsLoading(true);
      const res = await getClaimsByCustomer(customer.customerId);
      const claimsArr = Array.isArray(res) 
        ? res 
        : (res?.content && Array.isArray(res.content)) 
          ? res.content 
          : [];
      setCustomerClaims(claimsArr);
    } catch (e) {
      console.error("Error loading customer claims:", e);
      setCustomerClaims([]);
    } finally {
      setClaimsLoading(false);
    }
  };

  // Correlate Data
  const matchedUser = useMemo(() => {
    if (!selectedCustomer) return null;
    if (!Array.isArray(usersList)) return null;
    return usersList.find(
      (u) => u && u.email?.toLowerCase() === selectedCustomer.email?.toLowerCase()
    );
  }, [selectedCustomer, usersList]);

  const customerPolicies = useMemo(() => {
    if (!selectedCustomer) return [];
    if (!Array.isArray(policiesList)) return [];
    const matchedPolicies = policiesList.filter(
      (p) => p && p.customerName?.toLowerCase() === selectedCustomer.fullName?.toLowerCase()
    );
    return matchedPolicies.map((policy) => {
      const matchedPlan = Array.isArray(plansList)
        ? plansList.find((plan) => plan && plan.planName?.toLowerCase() === policy.planName?.toLowerCase())
        : null;
      const matchedProduct = (matchedPlan && Array.isArray(productsList)) 
        ? productsList.find((prod) => prod && prod.productName === matchedPlan.productName)
        : null;
      return {
        ...policy,
        productName: matchedPlan?.productName || "N/A",
        productType: matchedProduct?.productType || "N/A",
        premiumAmount: matchedPlan?.premiumAmount || policy.premiumAmount || "N/A",
        coverageAmount: matchedPlan?.coverageAmount || policy.coverageAmount || "N/A"
      };
    });
  }, [selectedCustomer, policiesList, plansList, productsList]);

  const claimsStats = useMemo(() => {
    const total = Array.isArray(customerClaims) ? customerClaims.length : 0;
    const approved = Array.isArray(customerClaims) ? customerClaims.filter((c) => c && c.claimStatus === "APPROVED").length : 0;
    const rejected = Array.isArray(customerClaims) ? customerClaims.filter((c) => c && c.claimStatus === "REJECTED").length : 0;
    const pending = Array.isArray(customerClaims) ? customerClaims.filter(
      (c) => c && c.claimStatus !== "APPROVED" && c.claimStatus !== "REJECTED"
    ).length : 0;
    return { total, approved, rejected, pending };
  }, [customerClaims]);

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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
          />
        </div>

        {/* State Filter */}
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          }}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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

                <div className="space-y-1.5 text-xs text-slate-450 dark:text-slate-500 font-medium">
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
                onClick={() => handleOpenDetails(ele)}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-slate-800 dark:text-white my-8"
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

              {/* TABS NAVIGATION */}
              <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                {["profile", "policies", "claims"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 transition ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* DETAILS TABS CONTENT */}
              {activeTab === "profile" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-2 text-sm">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850">
                    <User className="text-slate-400" size={18} />
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Customer ID</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-250">#{selectedCustomer.customerId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850">
                    <Mail className="text-slate-400" size={18} />
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Email Address</span>
                      <span className="font-semibold text-slate-850 dark:text-slate-250 truncate block">{selectedCustomer.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850">
                    <Phone className="text-slate-400" size={18} />
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Phone Number</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-250">{matchedUser?.mobileNumber || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850">
                    <Activity className="text-slate-400" size={18} />
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Gender</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-250">N/A (Not Supported by Backend)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850">
                    <Calendar className="text-slate-400" size={18} />
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Date of Birth</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-250">{selectedCustomer.dateOfBirth || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850">
                    <FileClock className="text-slate-400" size={18} />
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Registration Date</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-250">
                        {matchedUser?.createdDate ? new Date(matchedUser.createdDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850">
                    <UserCheck className="text-slate-400" size={18} />
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Status</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-xs ${matchedUser?.active ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                        {matchedUser?.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850">
                    <Shield className="text-slate-400" size={18} />
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Nominee Details</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-250">
                        {selectedCustomer.nomineeName || "N/A"} ({selectedCustomer.nomineeRelation || "Relation N/A"})
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850">
                    <MapPin className="text-slate-400" size={18} />
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">Full Address</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-250">
                        {selectedCustomer.address || "N/A"}, {selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.pinCode}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "policies" && (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {customerPolicies.length > 0 ? (
                    <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-150 dark:border-slate-850">
                            <th className="p-3">Policy Number</th>
                            <th className="p-3">Product Name</th>
                            <th className="p-3">Policy Name</th>
                            <th className="p-3">Premium</th>
                            <th className="p-3">Coverage</th>
                            <th className="p-3">Period</th>
                            <th className="p-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerPolicies.map((policy) => (
                            <tr key={policy.policyId} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/40 dark:hover:bg-slate-950/30">
                              <td className="p-3 font-mono font-semibold">{policy.policyNumber}</td>
                              <td className="p-3 font-semibold">{policy.productName} <span className="text-[10px] text-slate-400 font-medium">({policy.productType})</span></td>
                              <td className="p-3 font-semibold text-slate-650 dark:text-slate-300">{policy.planName}</td>
                              <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">₹{policy.premiumAmount}</td>
                              <td className="p-3 text-blue-600 dark:text-blue-400 font-bold">₹{policy.coverageAmount}</td>
                              <td className="p-3 text-slate-500 font-medium">
                                {policy.startDate ? new Date(policy.startDate).toLocaleDateString() : "N/A"} - {policy.endDate ? new Date(policy.endDate).toLocaleDateString() : "N/A"}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  policy.policyStatus === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                }`}>
                                  {policy.policyStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <Shield size={24} className="mx-auto text-slate-300 dark:text-slate-650 mb-1" />
                      <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">No Policies Purchased</h4>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "claims" && (
                <div className="space-y-5">
                  {/* Counts Widgets */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850 text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Total</span>
                      <p className="text-lg font-black text-slate-800 dark:text-slate-200">{claimsStats.total}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 text-center">
                      <span className="text-[10px] text-emerald-500 font-bold uppercase block mb-0.5">Approved</span>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-450">{claimsStats.approved}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 text-center">
                      <span className="text-[10px] text-amber-500 font-bold uppercase block mb-0.5">Pending</span>
                      <p className="text-lg font-black text-amber-600 dark:text-amber-450">{claimsStats.pending}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 text-center">
                      <span className="text-[10px] text-rose-505 font-bold uppercase block mb-0.5">Rejected</span>
                      <p className="text-lg font-black text-rose-600 dark:text-rose-450">{claimsStats.rejected}</p>
                    </div>
                  </div>

                  {/* Claims List Table */}
                  <div className="max-h-[250px] overflow-y-auto pr-1">
                    {claimsLoading ? (
                      <div className="text-center py-6 text-slate-400 animate-pulse text-xs">Loading claims...</div>
                    ) : customerClaims.length > 0 ? (
                      <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-150 dark:border-slate-850">
                              <th className="p-3">Claim ID</th>
                              <th className="p-3">Claim Number</th>
                              <th className="p-3">Amount</th>
                              <th className="p-3">Reason</th>
                              <th className="p-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerClaims.map((claim) => (
                              <tr key={claim.claimId} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/40 dark:hover:bg-slate-950/30">
                                <td className="p-3 font-semibold">#{claim.claimId}</td>
                                <td className="p-3 font-mono font-semibold text-slate-500">{claim.claimNumber}</td>
                                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">₹{claim.claimAmount}</td>
                                <td className="p-3 text-slate-650 dark:text-slate-300 font-medium truncate max-w-[200px]">{claim.claimReason}</td>
                                <td className="p-3 text-center">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    claim.claimStatus === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                                    claim.claimStatus === "REJECTED" ? "bg-rose-500/10 text-rose-500" :
                                    "bg-yellow-500/10 text-yellow-550 dark:text-yellow-400"
                                  }`}>
                                    {claim.claimStatus}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <FileClock size={24} className="mx-auto text-slate-300 dark:text-slate-650 mb-1" />
                        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">No Claims History Found</h4>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
