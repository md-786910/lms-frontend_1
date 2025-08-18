import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Login from "./pages/Login";

import AdminLayout from "./components/layout/AdminLayout";
import EmployeeLayout from "./components/layout/EmployeeLayout";
import CompanyLayout from "./components/layout/CompanyLayout";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminEmployees from "./pages/admin/Employees";
import AdminSalary from "./pages/admin/Salary";
import AdminLeave from "./pages/admin/Leave";
import AdminTiming from "./pages/admin/Timing";
import AdminSettings from "./pages/admin/Settings";

import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeProfile from "./pages/employee/Profile";
import EmployeeLeave from "./pages/employee/Leave";
import EmployeeTimeLogs from "./pages/employee/TimeLogs";
import EmployeeSalary from "./pages/employee/Salary";

import CompanyHome from "./pages/company-listing/Home";
import CompanyAbout from "./pages/company-listing/About";
import CompanyServices from "./pages/company-listing/Services";
import CompanyPricing from "./pages/company-listing/Pricing";
import CompanyContact from "./pages/company-listing/Contact";
import CompanyGetStarted from "./pages/company-listing/GetStarted";

import ProtectedRoute from "./components/ProtectedRoute";

import Company from "./components/settings/Company";
import SettingLayout from "./components/layout/SettingLayout";
import Prefix from "./components/settings/Prefix";
import Currency from "./components/settings/Currency";
import Departments from "./components/settings/Departments";
import Designations from "./components/settings/Designations";
import Leave from "./components/settings/Leave";
import Templates from "./components/settings/Templates";
import Documents from "./components/settings/Documents";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SetNewPassword from "./pages/SetNewPassword";
import HistoryPage from "./pages/admin/History";
import EmployeProfileLayout from "./components/layout/EmployeProfileLayout";
import BasicInfo from "./pages/employee/profile/BasicInfo";
import Address from "./pages/employee/profile/Address";
import Document from "./pages/employee/profile/Document";
import PersonanInfo from "./pages/employee/profile/PersonanInfo";
import Salary from "./pages/employee/Salary";
import SalaryInfo from "./pages/employee/profile/SalaryInfo";
import User from "./pages/admin/User";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Company Website Routes */}
          <Route path="/company" element={<CompanyLayout />}>
            <Route index element={<CompanyHome />} />
            <Route path="about" element={<CompanyAbout />} />
            <Route path="services" element={<CompanyServices />} />
            <Route path="pricing" element={<CompanyPricing />} />
            <Route path="contact" element={<CompanyContact />} />
            <Route path="get-started" element={<CompanyGetStarted />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/company" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/employee/verify-email" element={<SetNewPassword />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={["admin", "light_admin"]} />}
          >
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="employees" element={<AdminEmployees />} />
              <Route path="salary" element={<AdminSalary />} />
              <Route path="leave" element={<AdminLeave />} />
              <Route path="timing" element={<AdminTiming />} />
              <Route path="user" element={<User />} />

              <Route path="history" element={<HistoryPage />} />
              <Route path="settings" element={<AdminSettings />} />

              {/* keep as children setting */}
              {/* <Route path="company" element={<AdminSettings />} /> */}
              <Route path="settings" element={<SettingLayout />}>
                <Route index element={<Navigate to="company" replace />} />
                <Route
                  path="company"
                  element={<Company value="comp" />}
                  index
                />
                <Route path="prefix" element={<Prefix value="comp" />} />
                <Route path="currency" element={<Currency value="comp" />} />
                <Route
                  path="departments"
                  element={<Departments value="comp" />}
                />
                <Route
                  path="designations"
                  element={<Designations value="comp" />}
                />
                <Route path="leave" element={<Leave value="comp" />} />
                <Route
                  path="document-category"
                  element={<Documents value="comp" />}
                />
                <Route path="templates" element={<Templates value="comp" />} />
              </Route>
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={<ProtectedRoute allowedRoles={["employee"]} />}
          >
            <Route element={<EmployeeLayout />}>
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="profile" element={<EmployeProfileLayout />}>
                <Route index element={<Navigate to="basic" replace />} />
                <Route path="basic" element={<BasicInfo />} index />
                <Route path="address" element={<Address />} />
                <Route path="documents" element={<Document />} />
                <Route path="personal" element={<PersonanInfo />} />
                <Route path="salary" element={<SalaryInfo />} />
              </Route>
              <Route path="leave" element={<EmployeeLeave />} />
              <Route path="time-logs" element={<EmployeeTimeLogs />} />
              <Route path="salary" element={<EmployeeSalary />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
