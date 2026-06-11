import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackendApi from '../AxiInt';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const RequestLeave = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    leavetype: 'SICK', 
    start_date: '',
    end_date: '',
    reason: ''
  });

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await BackendApi.post('/leave/CreateLeave/', formData);
      setMessage({ type: 'success', text: 'Leave request submitted successfully!' });
      
      // Navigate back to leave page after a short delay so the user sees the success message
      setTimeout(() => {
        navigate('/leave');
      }, 1500);

    } catch (error) {
      console.error("Create leave error:", error);
      setMessage({ type: 'error', text: error.response?.data?.error || "Failed to submit request." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-2xl mx-auto w-full">
      
      {/* Back Button & Header */}
      <div className="flex flex-col space-y-4">
        <button 
          onClick={() => navigate('/leave')} 
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leave Management
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Request Time Off</h1>
          <p className="text-slate-500 mt-1">Submit your request to HR or your Manager for approval.</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="border border-slate-200 bg-white rounded-2xl p-6 md:p-8 w-full shadow-sm">
        
        {/* Alert Messages */}
        {message.text && (
          <div className={`p-4 rounded-xl flex items-center gap-3 mb-6 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="font-medium text-sm">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleCreateLeave} className="flex flex-col space-y-6">
          
          {/* Leave Type */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-slate-700">Leave Type</label>
            <select 
              required
              value={formData.leavetype}
              onChange={(e) => setFormData({...formData, leavetype: e.target.value})}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="ANNUAL">Annual Leave</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-slate-700">Start Date</label>
              <input 
                type="date" 
                required
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-slate-700">End Date</label>
              <input 
                type="date" 
                required
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-slate-700">Reason</label>
            <textarea 
              required
              rows="4"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Briefly explain your reason for requesting time off..."
            ></textarea>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/leave')}
              className="w-full sm:w-auto px-6 py-3 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-70 transition-colors shadow-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
          
        </form>
      </div>

    </div>
  );
};

export default RequestLeave;