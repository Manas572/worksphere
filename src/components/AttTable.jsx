import React from 'react';
import Pagination from './Pagination';

const AttendanceTable = ({ 
  history, 
  activeTab, 
  loading,
  currentPage, 
  setCurrentPage, 
  hasNext, 
  hasPrev 
}) => {
  
  // Moved format functions here to keep them scoped to the table
  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "---";
    return new Date(isoString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          {activeTab === 'all_records' ? "Company Attendance" : "Recent History"}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
              {activeTab === 'all_records' && <th className="px-6 py-4">Employee ID</th>}
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Check In</th>
              <th className="px-6 py-4">Check Out</th>
              <th className="px-6 py-4 text-center">Hours</th>
              <th className="px-6 py-4">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.length === 0 ? (
              <tr>
                <td colSpan={activeTab === 'all_records' ? "7" : "6"} className="px-6 py-12 text-center text-slate-500">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              history.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {activeTab === 'all_records' && (
                    <td className="px-6 py-4 font-medium text-indigo-900 whitespace-nowrap">
                      {record.employee_name || `Emp #${record.employee}`}
                    </td>
                  )}

                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                    {formatDate(record.date)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      record.status === 'PRESENT' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : record.status === 'LATE'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {record.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {formatTime(record.check_in)}
                  </td>

                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {formatTime(record.check_out)}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="font-semibold text-slate-700">
                      {record.working_hours ? `${record.working_hours}h` : '--'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {record.day_type ? record.day_type.replace(/_/g, ' ') : '--'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {history.length > 0 && (
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

export default AttendanceTable;