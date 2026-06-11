import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, hasNext, hasPrev, loading }) => {
  const handlePrev = () => {
    if (hasPrev && !loading) setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    if (hasNext && !loading) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="flex items-center justify-center w-full mt-10">
      <div className="flex items-center justify-between w-full max-w-xs text-gray-500 font-medium">
        
        {/* Previous Button */}
        <button 
          type="button" 
          onClick={handlePrev}
          disabled={!hasPrev || loading}
          aria-label="prev" 
          className="rounded-full bg-slate-200/50 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-10 w-10 flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
          </svg>
        </button>
    
        {/* Dynamic Numbered Pages */}
        <div className="flex items-center gap-2 text-sm font-medium">
          {/* Show Previous Page Number if it exists */}
          {hasPrev && (
            <button 
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={loading}
              className="h-10 w-10 flex items-center justify-center aspect-square rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {currentPage - 1}
            </button>
          )}

          {/* Current Active Page */}
          <button className="h-10 w-10 flex items-center justify-center aspect-square text-blue-600 bg-blue-50 border border-blue-200 rounded-full shadow-sm">
            {currentPage}
          </button>

          {/* Show Next Page Number if it exists */}
          {hasNext && (
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={loading}
              className="h-10 w-10 flex items-center justify-center aspect-square rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {currentPage + 1}
            </button>
          )}
        </div>
    
        {/* Next Button */}
        <button 
          type="button" 
          onClick={handleNext}
          disabled={!hasNext || loading}
          aria-label="next" 
          className="rounded-full bg-slate-200/50 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-10 w-10 flex items-center justify-center"
        >
          <svg className="rotate-180" width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
          </svg>
        </button>

      </div>
    </div>
  );
};

export default Pagination;