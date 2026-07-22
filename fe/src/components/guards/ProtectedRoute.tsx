import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

export function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className={cn(
          'min-h-screen flex items-center justify-center font-semibold text-xs select-none',
          'bg-background text-brand'
        )}
      >
        Verifying session...
      </div>
    );
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
