import { Toaster } from "react-hot-toast"
import { Routes, Route, Navigate } from "react-router-dom"
import LoginLanding from "./pages/LoginLanding"
import Layout from "./pages/Layout"
import Employees from "./pages/Employees"
import Dashboard from "./pages/Dashboard"
import Leave from "./pages/Leave"
import Attendance from "./pages/Attendance"
import LoginForm from "./components/LoginForm"
import PrintPayslip from "./pages/PrintPayslip"
import EmployeeForm from "./components/EmpForm"
import RequestLeave from "./components/ReqLeave"
import ViewPayslip from "./pages/PrintPayslip"
import Payslips from "./pages/payslips"

function App() {
 
  return (
    <>
    <Toaster />
    <Routes>
      <Route path='/login' element={<LoginLanding />} />
      <Route element={<Layout />}>
      <Route path='/employees' element={<Employees />} />      
      <Route path='/dashboard' element={<Dashboard />} />      
      <Route path='/leave' element={<Leave />} />      
      <Route path="/employees/add" element={<EmployeeForm />} />
      <Route path="/request-leave" element={<RequestLeave />} />
      <Route path='/payslips' element={<Payslips />} />      
      <Route path='/attendance' element={<Attendance />} />      
      </Route>
      <Route path="/view-payslip" element={<ViewPayslip />} />
       <Route path='/login/employee' element={<LoginForm role="EMPLOYEE" title="Employee Portal" subtitle="Sign in to access your account"/>} />
       <Route path='/login/admin' element={<LoginForm role="ADMIN" title="Admin Portal" subtitle="Sign in to manage the organization"/>} />
       <Route path='*' element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </>
  )
}

export default App
