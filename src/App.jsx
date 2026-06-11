import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginLanding from "./pages/LoginLanding";
import Layout from "./pages/Layout";
import Employees from "./pages/Employees";
import Dashboard from "./pages/Dashboard";
import Leave from "./pages/Leave";
import Attendance from "./pages/Attendance";
import LoginForm from "./components/LoginForm";
import EmployeeForm from "./components/EmpForm";
import RequestLeave from "./components/ReqLeave";
import ViewPayslip from "./pages/PrintPayslip";
import Payslips from "./pages/Payslips";
import { useAuthStore } from "./store";

// --- ROUTE GUARDS ---

// 1. ProtectedRoute: Checks Zustand for an accessToken
const ProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// 2. PublicRoute: Bounces logged-in users away from auth pages
const PublicRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

// 3. RoleRoute: Checks the user's role from Zustand against allowed roles
const RoleRoute = ({ allowedRoles }) => {
  const role = useAuthStore((state) => state.role);
  
  // If the user's role isn't in the allowed array, bounce them to the dashboard
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};


function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginLanding />} />
          <Route path="/login/employee" element={<LoginForm role="EMPLOYEE" title="Employee Portal" subtitle="Sign in to access your account" />} />
          <Route path="/login/admin" element={<LoginForm role="ADMIN" title="Admin Portal" subtitle="Sign in to manage the organization" />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/request-leave" element={<RequestLeave />} />
            <Route path="/payslips" element={<Payslips />} />
            <Route path="/attendance" element={<Attendance />} />

            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/add" element={<EmployeeForm />} />
            </Route>
          </Route>

          <Route path="/view-payslip" element={<ViewPayslip />} />
          
        </Route>
        <Route path="*" element={<Navigate to={accessToken ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </>
  );
}

export default App;