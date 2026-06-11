import React from 'react';
import { useAuthStore } from '../store';
import EmployeeDashboard from '../components/EmployeeDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  const role = useAuthStore((state) => state.role);

  if (role === 'ADMIN') {
    return <AdminDashboard />;
  } 
  
  return <EmployeeDashboard />;
};

export default Dashboard;