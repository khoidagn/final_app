import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth.types';

export function AdminRoute() {
  const { isLoggedIn, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-brand font-semibold text-xs">
        Checking permissions...
      </div>
    );
  }

  // Chặn nghiêm ngặt dựa vào định dạng Enum Role mới từ Database
  const isAdmin = isLoggedIn && user?.role === UserRole.ADMIN;

  return isAdmin ? <Outlet /> : <Navigate to="/discovery" replace />;
}
