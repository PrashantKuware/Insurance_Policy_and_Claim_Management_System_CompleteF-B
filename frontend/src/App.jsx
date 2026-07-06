import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Layouts
import AdminLayout from "./components/AdminLayout";
import AgentLayout from "./components/AgentLayout";
import CustomerLayaout from "./components/CustomerLayaout";

// Core Components
import Login from "./components/Login";
import Register from "./components/Register";

// Pages
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

// Submodules
import AllProducts from "./components/AllProducts";
import AddProduct from "./components/AddProduct";
import AllCustomers from "./components/AllCustomers";
import AddCustomer from "./components/AddCustomer";
import AllAgents from "./components/AllAgents";
import AddAgent from "./components/AddAgent";
import AddPolicyPlan from "./components/AddPolicyPlan";
import ViewPolicyPlan from "./components/ViewPolicyPlan";
import PurchasePolicy from "./components/PurchasePolicy";
import ViewClaim from "./components/ViewClaim";
import SubmitClaim from "./components/SubmitClaim";

// Dynamic Layout Selector Wrapper for shared routes
const LayoutWrapper = ({ children }) => {
  const role = localStorage.getItem("role");
  if (role === "ADMIN") {
    return <AdminLayout>{children}</AdminLayout>;
  } else if (role === "AGENT") {
    return <AgentLayout>{children}</AgentLayout>;
  } else {
    return <CustomerLayaout>{children}</CustomerLayaout>;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Credentials Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN RESTRICTED PANELS */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/allProducts"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AllProducts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addProduct"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/allCustomers"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AllCustomers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/allAgents"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AllAgents />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addagent"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AddAgent />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addplan/:productId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AddPolicyPlan />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* AGENT RESTRICTED PANELS */}
        <Route
          path="/agentdashboard"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentLayout>
                <AgentDashboard />
              </AgentLayout>
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER RESTRICTED PANELS */}
        <Route
          path="/customerdashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayaout>
                <CustomerDashboard />
              </CustomerLayaout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addCustomer"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
              <LayoutWrapper>
                <AddCustomer />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchasepolicy/:planId"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayaout>
                <PurchasePolicy />
              </CustomerLayaout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/submitclaim"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayaout>
                <SubmitClaim />
              </CustomerLayaout>
            </ProtectedRoute>
          }
        />

        {/* SHARED DYNAMIC CHANNELS */}
        <Route
          path="/viewallplan/:productId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CUSTOMER"]}>
              <LayoutWrapper>
                <ViewPolicyPlan />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewallclaim"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CUSTOMER"]}>
              <LayoutWrapper>
                <ViewClaim />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />

        {/* Fallback Redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
