import React, { useCallback, useEffect, useState } from 'react';
import { 
  Clock, CheckCircle2, LogOut, AlertCircle, CheckCircle
} from 'lucide-react';
import BackendApi from '../AxiInt';
import { useAuthStore } from '../store'; 
import Loading from '../components/Loading'; 
import AttendanceTabs from '../components/Atttabs';
import AttendanceTable from '../components/AttTable';

const Attendance = () => {
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === 'ADMIN'; 
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my_records'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); 
  const fetchTableData = useCallback(async (tab, page) => {
    setLoading(true);
    try {
      const baseEndpoint = tab === 'all_records' && isAdmin
        ? '/attendance/allAttendance/' 
        : '/attendance/EmpAttendance/';
        
      const endpoint = `${baseEndpoint}?page=${page}`;
      const response = await BackendApi.get(endpoint);
      
      if (response.data && response.data.results) {
        setHistory(response.data.results);
        setHasNext(response.data.next !== null);
        setHasPrev(response.data.previous !== null);
      } else {
        setHistory(response.data);
        setHasNext(false);
        setHasPrev(false);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      setMessage({ type: 'error', text: 'Failed to load attendance history.' });
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchPunchStatus = useCallback(async () => {
    try {
      const response = await BackendApi.get('/attendance/EmpAttendance/');
      const records = response.data.results ? response.data.results : response.data;
      
      if (records && records.length > 0) {
        const latestRecord = records[0]; 
        const today = new Date().toISOString().split('T')[0];
        
        if (latestRecord.date === today && !latestRecord.check_out) {
          setIsCheckedIn(true);
        } else {
          setIsCheckedIn(false);
        }
      }
    } catch (error) {
      console.error("Error fetching punch status:", error);
    }
  }, []);

  useEffect(() => {
    fetchPunchStatus();
  }, [fetchPunchStatus]);

  useEffect(() => {
    fetchTableData(activeTab, currentPage);
  }, [activeTab, currentPage, fetchTableData]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); 
  };

  const handlePunch = async () => {
    setIsSubmitting(true);
    setMessage({ type: '', text: '' }); 
    
    try {
      if (!isCheckedIn) {
        const response = await BackendApi.post('/attendance/checkin/');
        setIsCheckedIn(true);
        setMessage({ type: 'success', text: response.data.message || 'Checked in successfully!' });
      } else {
        const response = await BackendApi.post('/attendance/checkout/');
        setIsCheckedIn(false);
        setMessage({ type: 'success', text: response.data.message || 'Checked out successfully!' });
      }
      
      fetchPunchStatus();
      fetchTableData(activeTab, currentPage);
      
    } catch (error) {
      console.error("Punch error:", error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || "An error occurred while communicating with the server." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && history.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Attendance
          </h1>
          <p className="text-slate-500 mt-1">Manage daily logs and timesheets.</p>
        </div>
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

      {/* Top Action Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Clock className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Your Status: <span className={isCheckedIn ? "text-emerald-600" : "text-slate-500"}>
                {isCheckedIn ? "Checked In" : "Checked Out"}
              </span>
            </h2>
            <p className="text-slate-500 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <button 
          onClick={handlePunch}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
            isCheckedIn 
              ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" 
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
          }`}
        >
          {isSubmitting ? "Processing..." : isCheckedIn ? <><LogOut className="w-5 h-5" />Punch Out</> : <><CheckCircle2 className="w-5 h-5" />Punch In</>}
        </button>
      </div>

      {/* Admin Tabs */}
      {isAdmin && (
        <AttendanceTabs 
          activeTab={activeTab} 
          onTabChange={handleTabSwitch} 
        />
      )}

      {/* Extracted Attendance History Table */}
      <AttendanceTable 
        history={history}
        activeTab={activeTab}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />

    </div>
  );
};

export default Attendance;