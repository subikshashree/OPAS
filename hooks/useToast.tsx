import React, { useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning'} | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  const ToastComponent = () => !toast ? null : (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 fade-in duration-300">
      <div className={`px-6 py-3 rounded-2xl border backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex items-center gap-3 ${
        toast.type === 'success' ? 'bg-emerald-500/95 border-emerald-400 text-white' 
        : toast.type === 'warning' ? 'bg-amber-500/95 border-amber-400 text-white'
        : 'bg-rose-500/95 border-rose-400 text-white'
      }`}>
        <span className="font-bold">{toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : '🚨'}</span>
        <span className="font-semibold text-sm tracking-wide">{toast.message}</span>
      </div>
    </div>
  );
  
  return { showToast, ToastComponent };
}
