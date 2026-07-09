import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { EyeOff, Eye } from 'lucide-react';
interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

export default function PasswordField({
  label = 'Password',
  className,
  error,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn('w-full')}>
      {label && (
        <label
          className={cn('block text-xs font-semibold text-text-secondary mb-1')}
        >
          {label}
        </label>
      )}
      <div className={cn('relative w-full flex items-center')}>
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'w-full bg-surface border rounded-xs pl-3 pr-9 py-1.5 text-xs focus:outline-none placeholder-text-muted text-text-primary transition-all',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={cn(
            'absolute right-2.5 p-0.5 bg-transparent border-none cursor-pointer text-text-muted hover:text-text-secondary focus:outline-none',
            props.disabled && 'opacity-50 pointer-events-none'
          )}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
