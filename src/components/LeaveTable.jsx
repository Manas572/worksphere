import React from 'react';
import { CalendarDays, Check, XCircle } from 'lucide-react';
import Pagination from './Pagination'; // Adjust import path if needed

const LeaveTable = ({
  leaves,
  activeTab,
  loading,
  handleUpdateStatus,
  currentPage,
  setCurrentPage,
  hasNext,
  hasPrev
}) => {

  const formatDate = (isoString) => {
    if (!isoString) return "---";
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-slate-400" />
          {activeTab === 'all_leaves' ? "All Leave Requests" : "My Leave History"}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
              {activeTab === 'all_leaves' && <th className="px-6 py-4">Employee</th>}
              <th className="px-6 py-4">Leave Type</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4 text-center">Status</th>
              {activeTab === 'all_leaves' && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={activeTab === 'all_leaves' ? "6" : "4"} className="px-6 py-12 text-center text-slate-500">
                  No leave records found.
                </td>
              </tr>
            ) : (
              leaves.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {activeTab === 'all_leaves' && (
                    <td className="px-6 py-4 font-medium text-indigo-900 whitespace-nowrap">
                      {record.employee_name || `Emp #${record.employee}`}
                    </td>
                  )}

                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                    {record.leavetype}
                  </td>

                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {formatDate(record.start_date)} <br />
                    <span className="text-xs text-slate-400">to</span> {formatDate(record.end_date)}
                  </td>

                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                    {record.reason}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      record.statustype === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : record.statustype === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {record.statustype || 'PENDING'}
                    </span>
                  </td>

                  {activeTab === 'all_leaves' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {record.statustype === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(record.id, 'APPROVED')}
                            className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(record.id, 'REJECTED')}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">Actioned</span>
                      )}
                    </td>
                  )}

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Pagination Component */}
      {leaves.length > 0 && (
        <div className="px-6 pb-6 border-t border-slate-200 bg-slate-50/50">
          <Pagination 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            hasNext={hasNext}
            hasPrev={hasPrev}
            loading={loading}
          />
        </div>
      )}

    </div>
  );
};

export default LeaveTable;