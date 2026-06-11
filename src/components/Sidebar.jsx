import React, { useEffect, useState } from 'react';
import { useLocation, NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Briefcase, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../store'; 

const adminNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Employees', path: '/employees', icon: Users },
  { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
  { name: 'Leaves', path: '/leave', icon: FileText },
  { name: 'Payslips', path: '/payslips', icon: Briefcase },
];

const employeeNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
  { name: 'Leave Request', path: '/leave', icon: FileText },
  { name: 'My Payslips', path: '/payslips', icon: Briefcase },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navItems, setNavItems] = useState([]);

  // Get user data and actions from Zustand
  const role = useAuthStore((state) => state.role);
  const firstname = useAuthStore((state) => state.firstname);
  const email = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);

  // Set navigation items based on the real role
  useEffect(() => {
    if (role === 'ADMIN') {
      setNavItems(adminNavItems);
    } else {
      setNavItems(employeeNavItems);
    }
  }, [role]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const SidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 border-r border-slate-800">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-800/60 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-wide text-slate-100">
          Work<span className="text-cyan-400">Sphere</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
        
        {/* User Profile Info */}
        <div className="flex items-center gap-3 px-2">
          <img
            src={`https://ui-avatars.com/api/?name=${firstname || 'User'}&background=6366f1&color=fff`}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-slate-700 object-cover"
          />
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-slate-100 truncate capitalize">
              {firstname || 'User'}
            </span>
            <span className="text-xs text-slate-500 truncate">
              {email || 'user@company.com'}
            </span>
          </div>
        </div>
        
        <div>
          {/* Section Label */}
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Main Menu
          </p>

          {/* Navigation List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800/60">
        <Link 
          to="/login"
          onClick={() => logout()} // Clears the Zustand store on click
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center">
             <Briefcase className="w-4 h-4 text-white" />
           </div>
           <span className="text-lg font-bold text-white">WorkSphere</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-white focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:flex-shrink-0`}
      >
        {SidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;