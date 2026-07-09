import React, { useState, useCallback } from 'react';
import { ToastContext, type ToastType } from './toast.context';
import { cn } from '../utils/cn';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      setToast({ message, type });

      setTimeout(() => {
        setToast(null);
      }, 3500);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Global */}
      {toast && (
        <div
          className={cn(
            'fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-md shadow-md text-xs font-semibold flex items-center gap-2 animate-fade-in border',
            toast.type === 'success' &&
              'bg-white border-green-500 text-green-600',
            toast.type === 'error' && 'bg-white border-red-500 text-red-600',
            toast.type === 'info' && 'bg-white border-brand text-brand'
          )}
        >
          {toast.type === 'success' && '✨'}
          {toast.type === 'error' && '❌'}
          {toast.type === 'info' && 'ℹ️'}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
