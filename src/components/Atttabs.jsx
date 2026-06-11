import React from 'react';
import { CalendarDays, Users } from 'lucide-react';

const AttendanceTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
      <button
        onClick={() => onTabChange('my_records')}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
          activeTab === 'my_records'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <CalendarDays className="w-4 h-4" />
        My Records
      </button>
      <button
        onClick={() => onTabChange('all_records')}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
          activeTab === 'all_records'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <Users className="w-4 h-4" />
        All Employees
      </button>
    </div>
  );
};

export default AttendanceTabs;