import React from 'react';
import { AlertCircle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, employee, isDeleting }) => {
  // If the modal isn't open or there's no employee selected, don't render anything
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-4 text-red-600">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Delete Employee</h2>
        </div>
        
        {/* Warning Text */}
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{employee.firstname} {employee.lastname}</strong>? 
          This action will mark the employee as inactive and hide them from the directory.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 font-medium shadow-sm transition-all disabled:opacity-70 flex items-center"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteModal;