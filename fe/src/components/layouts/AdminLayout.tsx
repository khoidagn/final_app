import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { cn } from '../../utils/cn';

export default function AdminLayout() {
  const isSidebarCollapsed = false;

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col',
        'bg-background',
        'pb-16 md:pb-0'
      )}
    >
      <AdminNavbar />

      <div
        className={cn(
          'w-full px-0 py-0 sm:px-6 sm:py-8 flex-1 items-start gap-6 grid',
          'grid-cols-1',
          'md:grid-cols-[180px_1fr]',
          'lg:grid-cols-[120px_1fr_120px]',
          isSidebarCollapsed && 'md:grid-cols-[64px_1fr]'
        )}
      >
        <AdminSidebar />

        <main className={cn('w-full min-w-0')}>
          <Outlet />
        </main>

        <div className={cn('hidden lg:block w-[120px]')} />
      </div>
    </div>
  );
}
