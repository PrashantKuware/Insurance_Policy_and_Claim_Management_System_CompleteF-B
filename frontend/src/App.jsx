import React, { useEffect } from 'react'
import Login from './components/Login'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/admin/AdminDashboard'
import AgentDashboard from './pages/AgentDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import AddProduct from './components/forms/AddProduct'
import ViewPolicyPlan from './components/tables/ViewPolicyPlan'
import AddPolicyPlan from './components/forms/AddPolicyPlan'
import ProtectedRoute from './components/ProtectedRoute'
import { useDispatch } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { login } from './redux/authSlice'
import PurchasePolicy from './components/PurchasePolicy'
import ViewClaim from './components/ViewClaim'
import SubmitClaim from './components/SubmitClaim'
import AgentClaimReview from './components/AgentClaimReview'
import ViewAllClaimADMIN from './components/tables/ViewAllClaimADMIN'
import Forbidden from './components/Forbidden'
import ImpossibleLightbulb from './components/ImpossibleLightbulb'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddAgent from './components/forms/AddAgent'
import RegisterCustomer from './components/RegisterCustomer'
import AddCustomer from './components/AddCustomer'
import AdminLayout from './components/layout/AdminLayout'
import ViewClaimHistory from './components/ViewClaimHistory'
import AgentLayout from './components/AgentLayout'
import Navbar from './components/Navbar'
import InsuranceHero from './components/InsuranceHero'
import AgentProfile from './components/AgentProfile'
import CustomerLayout from './components/CustomerLayaout'
import MyPolicies from './components/MyPolicies'
import ViewAllPolicies from './components/ViewAllPolicy'
import CustomerProfile from './components/CustomerProfile'
import Product from './components/tables/Product'
import CustomerProduct from './components/CustomerProduct'
import CustomerViewPolicyPlan from './components/CustomerViewPolicyPlan'
import UpdateCustomer from './components/UpdateCustomer'
import ForgetPassword from '../ForgetPassword'


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
    <div className="
      min-h-screen
      bg-gradient-to-r
      from-indigo-50
      to-slate-50
      dark:from-gray-900
      dark:to-black
      text-gray-900
      dark:text-white
      transition-colors
      duration-300
    ">
      <Routes>
        <Route path="/" element={<InsuranceHero />} />
        <Route path="/unauthorized" element={<Forbidden />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterCustomer />} />
        <Route path="/forget-password" element={<ForgetPassword />} />


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

        {/* <Route
          path="/agentdashboard"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
             
              <Navbar />
              <AgentDashboard />
              
            </ProtectedRoute>
          }
        /> */}
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
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/policies"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayout>
                <ViewAllPolicies />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/customer/product/:productType"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayout>
                <CustomerProduct />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/product"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayout>
                <CustomerProduct />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayout>
                <CustomerProfile />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/edit-profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <UpdateCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/claim-history/claim/:claimId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CUSTOMER"]}>
              <ViewClaimHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/claim-history/policy/:policyId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CUSTOMER"]}>
              <ViewClaimHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viewallplan/:productId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <ViewPolicyPlan />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/viewallplancustomer/:productId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CUSTOMER"]}>
              <CustomerViewPolicyPlan />
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

        <Route
          path="/agentprofile"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentLayout>
                <AgentProfile />
              </AgentLayout>
            </ProtectedRoute>

          }
        />

        <Route
          path="/viewallclaimagent"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentLayout>
                <ViewAllClaimADMIN />
              </AgentLayout>
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
              <AdminLayout>
                <ViewAllClaimADMIN />
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