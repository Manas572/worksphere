import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import BackendApi from '../AxiInt';
import Loading from '../components/Loading';
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';
import LeaveTable from '../components/LeaveTable';
import LeaveTabs from '../components/LeaveTab';

const Leave = () => {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === 'ADMIN';
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my_leaves'); 
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const fetchLeaves = useCallback(async (tab, page) => {
    setLoading(true);
    try {
      const baseEndpoint = (tab === 'all_leaves' && isAdmin)
        ? '/leave/SeeLeaves/'
        : '/leave/SeeYourLeaves/';
        
      const endpoint = `${baseEndpoint}?page=${page}`;
      const response = await BackendApi.get(endpoint);
      
      if (response.data && response.data.results) {
        setLeaves(response.data.results);
        setHasNext(response.data.next !== null);
        setHasPrev(response.data.previous !== null);
      } else {
        setLeaves(response.data);
        setHasNext(false);
        setHasPrev(false);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setMessage({ type: 'error', text: 'Failed to load leave records.' });
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchLeaves(activeTab, currentPage);
  }, [activeTab, currentPage, fetchLeaves]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); 
  };

  const handleUpdateStatus = async (leaveId, newStatus) => {
    try {
      await BackendApi.patch(`/leave/update/${leaveId}/`, { statustype: newStatus });
      setMessage({ type: 'success', text: `Leave ${newStatus.toLowerCase()} successfully.` });
      fetchLeaves(activeTab, currentPage);
    } catch (error) {
      console.error("Update leave error:", error);
      setMessage({ type: 'error', text: "Failed to update leave status." });
    }
  };

  if (loading && leaves.length === 0) return <Loading />;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leave Management</h1>
          <p className="text-slate-500 mt-1">Request time off and track your balances.</p>
        </div>
        <button 
          onClick={() => navigate('/request-leave')} 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-sm shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Request Leave
        </button>
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      
      {isAdmin && (
        <LeaveTabs 
          activeTab={activeTab} 
          onTabChange={handleTabSwitch} 
        />
      )}

      
      <LeaveTable 
        leaves={leaves}
        activeTab={activeTab}
        loading={loading}
        handleUpdateStatus={handleUpdateStatus}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />

    </div>
  );
};

export default Leave;