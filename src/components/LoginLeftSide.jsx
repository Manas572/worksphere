import React from 'react';

const featureList = [
  { label: 'Smart Scheduling', dotColor: 'bg-cyan-400', pulse: true },
  { label: 'Real-time Analytics', dotColor: 'bg-indigo-400', pulse: false },
  { label: 'Automated Payroll', dotColor: 'bg-purple-400', pulse: false },
];

const LoginLeftSide = () => {
  return (
    <aside className="hidden md:flex w-1/2 relative overflow-hidden bg-slate-950 border-r border-slate-800">
      
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 z-0" aria-hidden="true" />

      <div 
        className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:64px_64px]" 
        aria-hidden="true" 
      />

      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 -right-20 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-3xl mix-blend-screen pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col justify-between p-12 lg:p-20 w-full h-full text-white">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wide text-slate-200">
            Work<span className="text-cyan-400">Sphere</span>
          </span>
        </div>

        <div className="mt-12 mb-auto pt-12 lg:pt-16">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-6 leading-tight tracking-tight">
            Modern <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Employee Management
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-10">
            Streamline your workforce management. Effortlessly track attendance, manage schedules, and boost productivity with our intuitive platform.
          </p>


          <div className="flex flex-wrap gap-4">
            {featureList.map((feature, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-700/50 text-sm text-slate-300 backdrop-blur-md hover:bg-slate-800/80 transition-colors cursor-default"
              >
                <span className={`w-2 h-2 rounded-full ${feature.dotColor} ${feature.pulse ? 'animate-pulse' : ''}`} />
                {feature.label}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-10 lg:pt-12 border-t border-slate-800/60 flex items-center gap-4">
         
          <div className="flex flex-col">
          
          </div>
        </div>

      </div>
    </aside>
  );
};

export default LoginLeftSide;