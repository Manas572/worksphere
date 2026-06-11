import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import BackendApi from '../AxiInt';

const DEPARTMENT_CHOICES = [
  "Engineering", "Human Resources", "Marketing", "Sales", "Finance", 
  "Operations", "IT Support", "Customer Success", "Product Management", "Design"
];

const EditEmployeeModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Auto-populate form when opening
  useEffect(() => {
    if (isOpen && employee) {
      setFormData({
        firstname: employee.firstname || '',
        lastname: employee.lastname || '',
        phone: employee.phone || '',
        position: employee.position || '',
        basicsalary: employee.basicsalary || '',
        allowances: employee.allowances || '0',
        deductions: employee.deductions || '0',
        department: employee.department || 'Engineering',
        joining_date: employee.joining_date || '',
        bio: employee.bio || ''
      });
      setSubmitError("");
    }
  }, [isOpen, employee]);

  if (!isOpen || !employee) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      await BackendApi.patch(`employee/update/${employee.id}/`, formData);
      onSuccess(); // Triggers the data refetch in the parent component
      onClose();   // Closes the modal
    } catch (error) {
      console.error(`Failed to update employee:`, error);
      setSubmitError(error.response?.data?.detail || "An error occurred. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl my-auto relative overflow-hidden flex flex-col lg:flex-row border border-gray-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Context / Branding */}
        <div className="bg-blue-50/50 p-8 lg:p-12 lg:w-2/5 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
            Directory Update
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            Update profile details.
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            Keep your employee records accurate and up to date to ensure seamless company operations and payroll processing.
          </p>

          <div className="flex items-center gap-4 mt-auto">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-12 lg:w-3/5 max-h-[85vh] overflow-y-auto scrollbar-hide">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{submitError}</span>
              </div>
            )}

            {/* Personal Details */}
            <div className="space-y-4 mb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">First Name</label>
                  <input type="text" name="firstname" required maxLength="50" value={formData.firstname} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Last Name</label>
                  <input type="text" name="lastname" required maxLength="50" value={formData.lastname} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                  <input type="text" name="phone" required maxLength="10" value={formData.phone} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
              </div>
            </div>
            
            {/* Employment Details */}
            <div className="space-y-4 mb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role & Department</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Position</label>
                  <input type="text" name="position" required maxLength="50" value={formData.position} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Department</label>
                  <select name="department" required value={formData.department} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer">
                    {DEPARTMENT_CHOICES.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600">Joining Date</label>
                  <input type="date" name="joining_date" required value={formData.joining_date} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
              </div>
            </div>
            
            {/* Compensation */}
            <div className="space-y-4 mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Compensation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Basic (₹)</label>
                  <input type="number" step="0.01" name="basicsalary" required value={formData.basicsalary} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Allowances (₹)</label>
                  <input type="number" step="0.01" name="allowances" value={formData.allowances} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Deductions (₹)</label>
                  <input type="number" step="0.01" name="deductions" value={formData.deductions} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs font-semibold text-gray-600">Bio (Optional)</label>
                <textarea name="bio" rows="3" maxLength="150" value={formData.bio} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 mt-2"
            >
              {isSubmitting ? "Saving Updates..." : "Save Changes"}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;