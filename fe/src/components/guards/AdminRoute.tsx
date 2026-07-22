import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/enum.type';
import { cn } from '../../utils/cn';

export function AdminRoute() {
  const { isLoggedIn, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className={cn(
          'min-h-screen flex items-center justify-center font-semibold text-xs select-none',
          'bg-background text-brand'
        )}
      >
        Checking permissions...
      </div>
    );
  }

  const isAdmin = isLoggedIn && user?.role === UserRole.ADMIN;

  return isAdmin ? <Outlet /> : <Navigate to="/discovery" replace />;
}
