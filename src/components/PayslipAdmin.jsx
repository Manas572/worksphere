import React from 'react';
import { X } from 'lucide-react';

const AdminPayslipPanel = ({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleGenerateSubmit,
  isSubmitting,
  employeesList=[],
  months=[],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">Generate Payslip</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleGenerateSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
            <select name="employee" required value={formData.employee} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="" disabled>-- Choose an employee --</option>
              {employeesList.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstname} {emp.lastname} ({emp.department || 'N/A'})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
              <select name="month" required value={formData.month} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <input type="number" name="year" required min="2000" max="2100" value={formData.year} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100 mt-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Basic Salary (₹)</label>
              <input type="number" step="0.01" name="basic_salary" required value={formData.basic_salary} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Allowances (₹)</label>
                <input type="number" step="0.01" name="allowances" required value={formData.allowances} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deductions (₹)</label>
                <input type="number" step="0.01" name="deductions" required value={formData.deductions} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-medium shadow-sm transition-all disabled:opacity-70">
              {isSubmitting ? "Generating..." : "Generate Payslip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPayslipPanel;