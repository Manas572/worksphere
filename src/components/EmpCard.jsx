import React, { useRef, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const divRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const bounds = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    };

    // Auto-generates a clean avatar based on their name
    const avatarUrl = `https://ui-avatars.com/api/?name=${employee.firstname}+${employee.lastname}&background=eff6ff&color=4f46e5&size=128&bold=true`;

    return (
        <div 
            ref={divRef} 
            onMouseMove={handleMouseMove} 
            onMouseEnter={() => setVisible(true)} 
            onMouseLeave={() => setVisible(false)}
            className="relative w-full h-[26rem] rounded-2xl p-[1px] bg-white text-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
        >
            {/* The Dynamic Glow Effect */}
            {visible && (
                <div 
                    className="pointer-events-none blur-2xl bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 size-60 absolute z-0 transition-opacity duration-300 opacity-30"
                    style={{ top: position.y - 120, left: position.x - 120 }}
                />
            )}

            {/* Inner Card Content */}
            <div className="relative z-10 bg-white/95 backdrop-blur-sm h-full w-full rounded-[15px] p-6 flex flex-col items-center justify-center text-center">
                
                {/* Top Right Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                        onClick={() => onEdit(employee)} 
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(employee)} 
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Profile Avatar & Header */}
                <img src={avatarUrl} alt="Profile Avatar" className="w-24 h-24 rounded-full shadow-md mt-2 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-1 capitalize truncate w-full">
                    {employee.firstname} {employee.lastname}
                </h2>
                <p className="text-sm text-indigo-500 font-medium mb-4">
                    {employee.position || 'Team Member'}
                </p>
                
                {/* Bio / Description */}
                <p className="text-sm text-gray-500 mb-auto px-2 line-clamp-3">
                    {employee.bio || 'Passionate about clean code, scalable systems, and solving real-world problems.'}
                </p>

                {/* Bottom Stats Line */}
                <div className="w-full pt-4 border-t border-gray-100 mt-4 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Department</span>
                        <span className="font-medium text-gray-800 truncate pl-2">{employee.department}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Salary</span>
                        <span className="font-semibold text-gray-800">
                            ₹{employee.basicsalary ? parseFloat(employee.basicsalary).toLocaleString() : '0'}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeCard;