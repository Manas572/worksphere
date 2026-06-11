import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, ArrowRight } from 'lucide-react';
import LoginLeftSide from '../components/LoginLeftSide';

const portalOptions = [
  {
    to: "/login/admin",
    title: "Admin Portal",
    description: "Manage employees, departments, payroll, and system configurations.",
    icon: Shield
  },
  {
    to: "/login/employee",
    title: "Employee Portal",
    description: "Access your profile, view payslips, request time off, and manage tasks.",
    icon: Users
  }
];

const LoginLanding = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      
      <LoginLeftSide />

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-white shadow-[0_0_40px_rgba(0,0,0,0.05)] z-10 rounded-l-3xl md:rounded-l-[3rem] -ml-4">
        
        <div className="max-w-md w-full space-y-10">
          
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Welcome to WorkSphere
            </h2>
            <p className="mt-3 text-slate-500 text-lg">
              Select your portal to sign in and continue.
            </p>
          </div>

          <div className="space-y-4">
            {portalOptions.map((portal) => {
              const Icon = portal.icon;
              return (
                <Link 
                  key={portal.to} 
                  to={portal.to}
                  className="group block bg-slate-50 border border-slate-200 rounded-lg p-5 sm:p-6 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50"
                >
                  <div className="flex items-center justify-between">
                    
                    <div className="flex items-start gap-4">
                      <Icon strokeWidth={2} className="w-6 h-6 mt-1 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                      <div>
                        <h3 className="text-lg text-slate-800 group-hover:text-indigo-600 mb-1 transition-colors">
                          {portal.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {portal.description}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-4" />
                    
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
};

export default LoginLanding;