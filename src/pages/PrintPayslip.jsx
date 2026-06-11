import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Banknote, Download, ArrowLeft } from 'lucide-react';

const MONTHS = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
];

const ViewPayslip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the payslip data passed through the router state
  const payslip = location.state?.payslip;

  const getMonthName = (monthNum) => {
    const month = MONTHS.find(m => m.value === parseInt(monthNum));
    return month ? month.label : "Unknown";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fallback if someone navigates to this URL directly without data
  if (!payslip) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500">No payslip data found.</p>
        <button onClick={() => navigate('/payslips')} className="text-indigo-600 font-medium">
          Return to Payslips
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto w-full">
      
      {/* Back Button - Hidden when printing */}
      <button 
        onClick={() => navigate('/payslips')} 
        className="print:hidden flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Payslips
      </button>

      {/* Payslip Document */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none print:m-0">
        
        {/* Document Header */}
        <div className="bg-indigo-600 p-8 text-white flex justify-between items-center print:bg-white print:text-slate-900 print:border-b print:border-slate-200">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Banknote className="w-8 h-8 print:text-slate-900" /> Salary Slip
            </h1>
            <p className="text-indigo-100 mt-2 text-lg print:text-slate-500">
              For the month of {getMonthName(payslip.month)} {payslip.year}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold tracking-tight">Your Company Name</h2>
            <p className="text-indigo-200 text-sm mt-1 print:text-slate-400">Human Resources</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Employee Details */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 print:bg-transparent print:p-0 print:border-none">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Employee Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Full Name</p>
                <p className="font-bold text-slate-900 text-lg capitalize">
                  {payslip.employee?.firstname || `Emp ID #${payslip.employee}`} {payslip.employee?.lastname || ''}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Department & Role</p>
                <p className="font-medium text-slate-700">
                  {payslip.employee?.department || 'N/A'} | {payslip.employee?.position || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Salary Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-slate-600 text-lg border-b border-slate-100 pb-4">
                <span>Basic Salary</span>
                <span className="font-medium text-slate-900">{formatCurrency(payslip.basic_salary)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-lg border-b border-slate-100 pb-4">
                <span>Allowances</span>
                <span className="font-medium text-emerald-600">+{formatCurrency(payslip.allowances)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-lg border-b border-slate-100 pb-4">
                <span>Deductions</span>
                <span className="font-medium text-red-600">-{formatCurrency(payslip.deductions)}</span>
              </div>
            </div>
          </div>

          {/* Total Net */}
          <div className="bg-slate-50 rounded-xl p-6 flex justify-between items-center print:bg-transparent print:p-0 print:pt-6">
            <span className="text-xl font-bold text-slate-900 uppercase tracking-wider">Net Salary</span>
            <span className="text-3xl font-black text-indigo-600">{formatCurrency(payslip.net_salary)}</span>
          </div>
          
          <p className="text-center text-sm text-slate-400 pt-8 print:text-xs">
            This is a computer-generated document. No signature is required.
          </p>
        </div>
      </div>

      {/* Print Action - Hidden when printing */}
      <div className="flex justify-end print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-sm active:scale-95"
        >
          <Download className="w-5 h-5" /> Print / Save as PDF
        </button>
      </div>

    </div>
  );
};

export default ViewPayslip;