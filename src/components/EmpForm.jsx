import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import BackendApi from '../AxiInt';

const DEPARTMENT_CHOICES = [
  "Engineering", "Human Resources", "Marketing", "Sales", "Finance", 
  "Operations", "IT Support", "Customer Success", "Product Management", "Design"
];

const initialFormState = {
  email: '',
  password: '',
  role: 'EMPLOYEE',
  firstname: '',
  lastname: '',
  phone: '',
  position: '',
  basicsalary: '',
  allowances: '0',
  deductions: '0',
  department: 'Engineering',
  joining_date: '',
  bio: ''
};

const EmployeeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const employeeToEdit = location.state?.employee;
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isEditMode && employeeToEdit) {
      setFormData({
        firstname: employeeToEdit.firstname || '',
        lastname: employeeToEdit.lastname || '',
        phone: employeeToEdit.phone || '',
        position: employeeToEdit.position || '',
        basicsalary: employeeToEdit.basicsalary || '',
        allowances: employeeToEdit.allowances || '0',
        deductions: employeeToEdit.deductions || '0',
        department: employeeToEdit.department || 'Engineering',
        joining_date: employeeToEdit.joining_date || '',
        bio: employeeToEdit.bio || ''
      });
    }
  }, [isEditMode, employeeToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      if (isEditMode) {
        await BackendApi.patch(`employee/update/${id}/`, formData);
      } else {
        await BackendApi.post('employee/create/', formData);
      }
      navigate('/employees');
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'add'} employee:`, error);
      setSubmitError(error.response?.data?.detail || "An error occurred. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-12 md:py-24 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Back Button Container */}
      <div className="max-w-6xl mx-auto w-full mb-8">
        <button 
          onClick={() => navigate('/employees')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </button>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Column: Context & Typography */}
        <div className="flex flex-col mt-4 lg:mt-10 lg:w-5/12">
          <p className="text-sm max-md:text-center font-semibold text-blue-600 uppercase tracking-widest mb-3">
            {isEditMode ? 'Directory Update' : 'Team Expansion'}
          </p>
          <h1 className="text-4xl lg:text-5xl/tight max-md:text-center font-extrabold text-gray-900 mb-6">
            {isEditMode ? "Update profile details." : "Let's build your team."}
          </h1>
          <p className="text-lg text-gray-500 max-md:text-center leading-relaxed mb-8">
            {isEditMode 
              ? "Keep your employee records accurate and up to date to ensure seamless company operations." 
              : "Bring new talent on board. Fill out the details to create a new profile and grant system access."}
          </p>
          
          {/* Decorative Icons matching the vibe */}
          <div className="flex items-center max-md:justify-center gap-5 mt-auto pb-8 lg:pb-0">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div className="w-full lg:w-7/12 bg-white border border-gray-200/80 rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-gray-200/50">
          <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            {isEditMode ? 'Employee Information' : 'New Hire Details'}
          </h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{submitError}</span>
              </div>
            )}
            
            {/* Account Details - Only show on Add */}
            {!isEditMode && (
              <div className="space-y-5 mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Access</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600">Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="name@company.com" className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600">Password</label>
                    <input type="password" name="password" required value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-600">Role</label>
                    <select name="role" required value={formData.role} onChange={handleInputChange} className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer">
                      <option value="EMPLOYEE">Employee</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Details */}
            <div className="space-y-5 mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-600">First Name</label>
                  <input type="text" name="firstname" required maxLength="50" value={formData.firstname} onChange={handleInputChange} placeholder="e.g. Manas" className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-600">Last Name</label>
                  <input type="text" name="lastname" required maxLength="50" value={formData.lastname} onChange={handleInputChange} placeholder="Kumar" className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                  <input type="text" name="phone" required maxLength="10" value={formData.phone} onChange={handleInputChange} placeholder="+91 00000 00000" className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
              </div>
            </div>
            
            {/* Employment Details */}
            <div className="space-y-5 mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role & Department</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-600">Position</label>
                  <input type="text" name="position" required maxLength="50" value={formData.position} onChange={handleInputChange} placeholder="Software Engineer" className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-600">Department</label>
                  <select name="department" required value={formData.department} onChange={handleInputChange} className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer">
                    {DEPARTMENT_CHOICES.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600">Joining Date</label>
                  <input type="date" name="joining_date" required value={formData.joining_date} onChange={handleInputChange} className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
              </div>
            </div>
            
            {/* Compensation */}
            <div className="space-y-5 mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Compensation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-600">Basic (₹)</label>
                  <input type="number" step="0.01" name="basicsalary" required value={formData.basicsalary} onChange={handleInputChange} placeholder="0.00" className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-600">Allowances (₹)</label>
                  <input type="number" step="0.01" name="allowances" value={formData.allowances} onChange={handleInputChange} placeholder="0.00" className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-600">Deductions (₹)</label>
                  <input type="number" step="0.01" name="deductions" value={formData.deductions} onChange={handleInputChange} placeholder="0.00" className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-5">
                <label className="text-xs font-semibold text-gray-600">Bio (Optional)</label>
                <textarea name="bio" rows="3" maxLength="150" value={formData.bio} onChange={handleInputChange} placeholder="Write a short introduction..." className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 mt-2"
            >
              {isSubmitting ? "Saving Data..." : (isEditMode ? "Save Changes" : "Create Profile")}
            </button>
            
          </form>
        </div>
      </div>
    </section>
  );
};

export default EmployeeForm;