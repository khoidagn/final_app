import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout processing failed:', error);
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogoutClick}
      disabled={isLoggingOut}
      className={cn(
        'bg-transparent border-none p-0 cursor-pointer text-white/80 hover:text-white hover:underline transition-colors text-sm font-medium',
        'active:scale-95 transform transition-transform disabled:opacity-50 disabled:no-underline',
        className
      )}
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}
