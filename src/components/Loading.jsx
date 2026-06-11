import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 w-full">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" strokeWidth={2.5} />
      <p className="text-slate-500 font-medium animate-pulse">
        Loading your dashboard...
      </p>
    </div>
  );
};

export default Loading;