import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
}

export default function BackButton({
  to,
  className,
  ...props
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); 
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        'text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs',
        'bg-brand hover:bg-brand-hover active:scale-95 transform transition-transform cursor-pointer border border-transparent',
        className
      )}
      {...props}
    >
      Back
    </button>
  );
}
