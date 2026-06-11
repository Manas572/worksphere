import React from 'react';
import { FileText, Users } from 'lucide-react';

const LeaveTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
      <button
        onClick={() => onTabChange('my_leaves')}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
          activeTab === 'my_leaves' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <FileText className="w-4 h-4" />
        My Leaves
      </button>
      <button
        onClick={() => onTabChange('all_leaves')}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
          activeTab === 'all_leaves' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <Users className="w-4 h-4" />
        Company Leaves
      </button>
    </div>
  );
};

export default LeaveTabs;