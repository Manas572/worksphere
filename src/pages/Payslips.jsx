import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  Plus, CheckCircle, AlertCircle
} from 'lucide-react';
import BackendApi from '../AxiInt';
import Loading from '../components/Loading';
import { useAuthStore } from '../store'; 

import PayslipTable from '../components/PayslipTable';
import AdminPayslipPanel from '../components/PayslipAdmin';

export const MONTHS = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
];

const initialFormState = {
  employee: '', 
  month: new Date().getMonth() + 1, 
  year: new Date().getFullYear(), 
  basic_salary: '',
  allowances: '0',
  deductions: '0'
};

const Payslips = () => {
  const navigate = useNavigate(); 
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === 'ADMIN';
  const [activeTab, setActiveTab] = useState('my_payslips'); 
  const [myPayslips, setMyPayslips] = useState([]);
  const [allPayslips, setAllPayslips] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // Form & Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchPayslips = useCallback(async (tab, page) => {
    setLoading(true);
    try {
      const baseEndpoint = tab === 'all_payslips' && isAdmin
        ? '/payslip/Seepayslip/'
        : '/payslip/SeeYourPayslip/';
        
      const endpoint = `${baseEndpoint}?page=${page}`;
      const response = await BackendApi.get(endpoint);
      
      let data = [];
      
      if (response.data && response.data.results) {
        data = response.data.results;
        setHasNext(response.data.next !== null);
        setHasPrev(response.data.previous !== null);
      } else {
        data = response.data;
        setHasNext(false);
        setHasPrev(false);
      }

      if (tab === 'all_payslips') {
        setAllPayslips(data);
      } else {
        setMyPayslips(data);
      }
    } catch (error) {
      console.error("Failed to fetch payslips:", error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchEmployees = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const response = await BackendApi.get('/allemployees/'); 
      const employeeData = response.data && response.data.results 
        ? response.data.results 
        : response.data;
        
      setEmployeesList(employeeData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchPayslips(activeTab, currentPage);
  }, [activeTab, currentPage, fetchPayslips]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await BackendApi.post('/payslip/Createpayslip/', formData);
      setMessage({ type: 'success', text: 'Payslip generated successfully!' });
      setIsCreateModalOpen(false);
      setFormData(initialFormState);
      fetchPayslips(activeTab, currentPage);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || error.response?.data?.error || "Failed to generate payslip." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // <-- Navigation Handler passed to Table
  const handleViewPayslip = (payslip) => {
    navigate('/view-payslip', { state: { payslip } }); 
  };

  if (loading && myPayslips.length === 0 && allPayslips.length === 0) return <Loading />;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payslips</h1>
          <p className="text-slate-500 mt-1">View your salary history and download payslips.</p>
        </div>
        
        {isAdmin && activeTab === 'all_payslips' && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-medium shadow-sm shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 w-fit"
          >
            <Plus className="w-5 h-5" /> Generate Payslip
          </button>
        )}
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => handleTabSwitch('my_payslips')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'my_payslips' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            My Payslips
          </button>
          
          {isAdmin && (
            <button
              onClick={() => handleTabSwitch('all_payslips')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'all_payslips' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            >
              Manage Payslips (Admin)
            </button>
          )}
        </nav>
      </div>

      <PayslipTable 
        activeTab={activeTab}
        payslips={activeTab === 'all_payslips' ? allPayslips : myPayslips}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onViewPayslip={handleViewPayslip} // <-- Passed the navigation handler
        getMonthName={getMonthName}
        formatCurrency={formatCurrency}
      />

      <AdminPayslipPanel 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleGenerateSubmit={handleGenerateSubmit}
        isSubmitting={isSubmitting}
        employeesList={employeesList}
        months={MONTHS}
      />

    </div>
  );
};

export default Payslips;