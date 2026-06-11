import React, { useCallback, useEffect, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import BackendApi from '../AxiInt';
import Pagination from '../components/Pagination';
import EmployeeCard from '../components/EmpCard';
import DeleteModal from '../components/Del'; 
import EditEmployeeModal from '../components/EmpModal';

const DEPARTMENT_CHOICES = [
  "Engineering", "Human Resources", "Marketing", "Sales", "Finance", 
  "Operations", "IT Support", "Customer Success", "Product Management", "Design"
];
const Employees = () => {
  const navigate = useNavigate(); 
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      if (search !== debouncedSearch) setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  // Fetch Data
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage });
      let endpoint = 'allemployees/'; 
      
      if (debouncedSearch) {
        endpoint = 'list/'; 
        params.append('search', debouncedSearch);
      } else if (selectedDepartment !== "All") {
        params.append('department', selectedDepartment);
      }

      const response = await BackendApi.get(`${endpoint}?${params.toString()}`); 
      
      if (response.data && response.data.results) {
        setEmployees(response.data.results);
        setHasNext(response.data.next !== null);
        setHasPrev(response.data.previous !== null);
      } else {
        setEmployees(response.data);
        setHasNext(false);
        setHasPrev(false);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedDepartment]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // UI Handlers
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (selectedDepartment !== "All") setSelectedDepartment("All");
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    if (search !== "") setSearch("");
    setCurrentPage(1);
  };

  // --- Actions ---
  
  // 1. ADD routes to the separate page
  const handleAddEmployee = () => {
    navigate('/employees/add');
  };

  // 2. EDIT opens the modal
  const handleEditEmployee = (employee) => {
    setEmployeeToEdit(employee);
    setIsEditModalOpen(true);
  };

  // 3. DELETE opens the modal
  const openDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    setIsDeleting(true);
    try {
      await BackendApi.delete(`employee/delete/${employeeToDelete.id}/`);
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      
      if (employees.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchEmployees();
      }
    } catch (error) {
      console.error("Failed to delete employee:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 relative max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
        <button 
          onClick={handleAddEmployee}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-medium shadow-sm shadow-blue-200 transition-all active:scale-95"
        >
          Add Employee
        </button>
      </div>

      {/* Unified Search & Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center w-full border border-gray-200 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden transition-all">
          <div className="flex items-center flex-1 w-full px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search employee by name or email..."
              value={search}
              onChange={handleSearchChange}
              className="flex-1 ml-3 outline-none bg-transparent text-gray-700 placeholder-gray-400 min-w-0"
            />
          </div>
          <div className="hidden sm:block h-8 w-px bg-gray-200 flex-shrink-0"></div>
          <div className="sm:hidden w-full h-px bg-gray-200 flex-shrink-0"></div>
          <div className="relative w-full sm:w-auto flex-shrink-0 bg-gray-50/50 sm:bg-transparent">
            <select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="w-full sm:w-auto appearance-none pl-4 pr-10 py-3 outline-none bg-transparent text-gray-700 font-medium cursor-pointer hover:bg-gray-50 focus:bg-gray-50 transition-colors"
            >
              <option value="All">All Departments</option>
              {DEPARTMENT_CHOICES.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
              <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-gray-500 font-medium animate-pulse">Loading employees...</p>
        </div>
      ) : (
        <>
          {/* Employee Cards Grid Component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employees.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No employees found matching your criteria.
              </div>
            ) : (
              employees.map((employee) => (
                <EmployeeCard 
                  key={employee.id} 
                  employee={employee} 
                  onEdit={handleEditEmployee} 
                  onDelete={openDeleteModal} 
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {employees.length > 0 && (
            <Pagination 
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              hasNext={hasNext}
              hasPrev={hasPrev}
              loading={loading}
            />
          )}
        </>
      )}

      
      {/* Componentized Edit Modal */}
      <EditEmployeeModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={employeeToEdit}
        onSuccess={fetchEmployees}
      />

      {/* Componentized Delete Modal */}
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        employee={employeeToDelete}
        isDeleting={isDeleting}
      />
      
    </div>
  );
};

export default Employees;