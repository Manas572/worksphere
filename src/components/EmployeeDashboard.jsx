import React, { useEffect, useState } from 'react';
import { 
  CalendarDays, 
  FileText, 
  IndianRupee, 
  CheckCircle2, 
  CalendarPlus,
  Banknote
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BackendApi from '../AxiInt';
import Loading from '../components/Loading';

const EmployeeDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentMonthAttendance: 0,
    pendingLeaves: 0,
    latestPayslip: null
  });

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      setLoading(true);
      try {
        const [attRes, leaveRes, payslipRes] = await Promise.all([
          BackendApi.get('/attendance/EmpAttendance/'),
          BackendApi.get('/leave/SeeYourLeaves/'),
          BackendApi.get('/payslip/SeeYourPayslip/')
        ]);

        const attendances = attRes.data.results || attRes.data;
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        
        const monthAttendance = attendances.filter(a => {
          const recordDate = new Date(a.date);
          return recordDate.getMonth() + 1 === currentMonth && recordDate.getFullYear() === currentYear;
        }).length;

        const leaves = leaveRes.data.results || leaveRes.data;
        const pendingCount = leaves.filter(l => l.statustype === 'PENDING').length;

        const payslips = payslipRes.data.results || payslipRes.data;
        const latest = payslips.length > 0 ? payslips[0].net_salary : null;

        setStats({
          currentMonthAttendance: monthAttendance,
          pendingLeaves: pendingCount,
          latestPayslip: latest
        });

      } catch (error) {
        console.error("Failed to fetch employee dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeStats();
  }, []);

  if (loading) return <Loading />;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  };

  const cards = [
    {
      icon: CalendarDays,
      value: stats.currentMonthAttendance,
      title: "Days Present",
      subtitle: "This Month",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100"
    },
    {
      icon: FileText,
      value: stats.pendingLeaves,
      title: "Pending Leaves",
      subtitle: "Awaiting Approval",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100"
    },
    {
      icon: IndianRupee,
      value: stats.latestPayslip ? formatCurrency(stats.latestPayslip) : "N/A",
      title: "Latest Payslip",
      subtitle: "Most Recent Payout",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100"
    }
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full bg-slate-50/50 min-h-screen">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back! 👋
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Here is what's happening with your profile today.
          </p>
        </div>
        
        <div className="inline-flex flex-shrink-0 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-default">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">{card.title}</p>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor} ${card.borderColor} border transition-colors duration-300`}>
                  <Icon className={`w-6 h-6 ${card.color}`} strokeWidth={2} />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

     {/* Quick Actions */}
      <div className="pt-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          
          <NavLink to="/attendance" className="group relative flex flex-col items-start p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-emerald-500 hover:shadow-md transition-all duration-300 text-left block">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Mark Attendance</h4>
            <p className="mt-1 text-sm text-slate-500">Clock in for your shift.</p>
          </NavLink>

          <NavLink to="/leave" className="group relative flex flex-col items-start p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-amber-500 hover:shadow-md transition-all duration-300 text-left block">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-100 transition-colors mb-4">
              <CalendarPlus className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">Apply for Leave</h4>
            <p className="mt-1 text-sm text-slate-500">Submit a time-off request.</p>
          </NavLink>

          <NavLink to="/payslips" className="group relative flex flex-col items-start p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-500 hover:shadow-md transition-all duration-300 text-left block">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors mb-4">
              <Banknote className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">View Payslips</h4>
            <p className="mt-1 text-sm text-slate-500">Check salary history.</p>
          </NavLink>

        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;