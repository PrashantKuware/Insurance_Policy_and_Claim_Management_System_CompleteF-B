import React, { useEffect } from 'react'
import Login from './components/Login'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import AgentDashboard from './pages/AgentDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import AddProduct from './components/AddProduct'
import ViewPolicyPlan from './components/ViewPolicyPlan'
import AddPolicyPlan from './components/AddPolicyPlan'
import ProtectedRoute from './components/ProtectedRoute'
import { useDispatch } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { login } from './redux/authSlice'
import PurchasePolicy from './components/PurchasePolicy'
import ViewClaim from './components/ViewClaim'
import SubmitClaim from './components/SubmitClaim'
import AgentClaimReview from './components/AgentClaimReview'
import ViewAllClaimADMIN from './components/ViewAllClaimADMIN'
import Forbidden from './components/Forbidden'
import ImpossibleLightbulb from './components/ImpossibleLightbulb'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddAgent from './components/AddAgent'
import RegisterCustomer from './components/RegisterCustomer'
import AddCustomer from './components/AddCustomer'
import AdminLayout from './components/AdminLayout'

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      const decoded = jwtDecode(token);

      dispatch(
        login({
          token,
          role: decoded.role
        })
      );
    }

  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Forbidden />} />


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
          path="/admindashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agentdashboard"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customerdashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addProduct"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viewallplan/:productId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CUSTOMER"]}>
              <ViewPolicyPlan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addplan/:productId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddPolicyPlan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchasepolicy/:planId"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <PurchasePolicy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/policy/:policyId"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <ViewClaim />
            </ProtectedRoute>
          }
        />

        <Route
          path="/policy/submitclaim/:policyId"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <SubmitClaim />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:claimId/review"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentClaimReview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viewallclaim"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ViewAllClaimADMIN />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addagent"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddAgent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <RegisterCustomer />
          }
        />
        <Route
          path="/addCustomer"
          element={
            <AddCustomer />
          }
        />

        <Route
          path="*"
          element={<ImpossibleLightbulb />}
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </div>
  )
}

export default App