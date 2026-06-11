import React, { useEffect, useState } from 'react';
import { 
  CalendarDays, 
  FileText, 
  Users, 
  TrendingUp, 
  UserPlus,
  List,
  CheckSquare,
  Banknote
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BackendApi from '../AxiInt';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    todayAttendance: 0,
    pendingLeaves: 0
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const [empRes, attRes, leaveRes] = await Promise.all([
          BackendApi.get('/allemployees/'),
          BackendApi.get('/attendance/allAttendance/'),
          BackendApi.get('/leave/SeeLeaves/')
        ]);

        const employees = empRes.data.results || empRes.data;
        const totalEmp = employees.length;

        const attendances = attRes.data.results || attRes.data;
        const today = new Date().toISOString().split('T')[0];
        const todayCheckIns = attendances.filter(a => a.date === today).length;

        const leaves = leaveRes.data.results || leaveRes.data;
        const pendingCount = leaves.filter(l => l.statustype === 'PENDING').length;

        setStats({
          totalEmployees: totalEmp,
          todayAttendance: todayCheckIns,
          pendingLeaves: pendingCount
        });

      } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <Loading />;

  const kpiCards = [
    {
      icon: Users,
      value: stats.totalEmployees,
      label: "Total Employees",
      description: "Active Workforce",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      icon: CalendarDays,
      value: stats.todayAttendance,
      label: "Today's Attendance",
      description: "Checked in Today",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100"
    },
    {
      icon: FileText,
      value: stats.pendingLeaves,
      label: "Pending Leaves",
      description: "Awaiting Approval",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100"
    }
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full bg-slate-50/50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Admin Overview 
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Monitor your organization's performance and manage workforce operations.
          </p>
        </div>
        
        <div className="inline-flex flex-shrink-0 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {kpiCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-default">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border transition-colors duration-300`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} strokeWidth={2} />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Management Actions */}
      <div className="pt-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Command Center</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          <NavLink to="/employees/add" className="group relative flex flex-col items-start p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-500 hover:shadow-md transition-all duration-300 text-left block">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors mb-4">
              <UserPlus className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Add Employee</h4>
            <p className="mt-1 text-sm text-slate-500">Onboard a new team member.</p>
          </NavLink>

          <NavLink to="/leave" className="group relative flex flex-col items-start p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-amber-500 hover:shadow-md transition-all duration-300 text-left block">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-100 transition-colors mb-4">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">Manage Leaves</h4>
            <p className="mt-1 text-sm text-slate-500">Approve or reject requests.</p>
          </NavLink>

          <NavLink to="/payslips" className="group relative flex flex-col items-start p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-emerald-500 hover:shadow-md transition-all duration-300 text-left block">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors mb-4">
              <Banknote className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Generate Payslips</h4>
            <p className="mt-1 text-sm text-slate-500">Process monthly salaries.</p>
          </NavLink>

          <NavLink to="/employees" className="group relative flex flex-col items-start p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 text-left block">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors mb-4">
              <List className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Directory</h4>
            <p className="mt-1 text-sm text-slate-500">View all staff records.</p>
          </NavLink>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;