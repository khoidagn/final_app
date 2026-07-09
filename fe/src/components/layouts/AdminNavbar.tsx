import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import LogoutButton from '../ui/LogoutButton'; 
import { getFullName } from '../../utils/string';
import { cn } from '../../utils/cn';

export default function AdminNavbar() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <nav className={cn('bg-brand h-14 w-full sticky top-0 z-50 shadow-sm')} />;
  }

  return (
    <nav className={cn('bg-brand text-white shadow-sm sticky top-0 z-50 p-3 flex flex-col gap-3 sm:py-2 sm:px-6')}>
      <div className={cn('w-full flex flex-row gap-2 items-center justify-between sm:grid sm:grid-cols-[120px_1fr_120px] sm:gap-6')}>
        
        {/* LOGO ADMIN */}
        <div className={cn('shrink-0 sm:min-w-0')}>
          <Link to="/admin" className={cn('text-sm font-bold tracking-wide text-white text-decoration-none block truncate active:scale-98 transition-transform')}>
            Fotobook Admin
          </Link>
        </div>

        {/* THANH SEARCH & AVATAR ADMIN */}
        <div className={cn('flex flex-row items-center justify-end sm:justify-between flex-1 sm:min-w-0')}>
          <div className={cn('hidden sm:block w-full max-w-xl mr-4')}>
            <input type="text" placeholder="Search Photo / Album" className={cn('w-full bg-surface text-text-primary px-4 py-1.5 rounded-xs text-sm focus:outline-none placeholder-text-muted shadow-inner focus:ring-2 focus:ring-accent/50 transition-all')} />
          </div>

          {user ? (
            <Link to="/my-profile/edit" className={cn('flex items-center space-x-2 text-white text-decoration-none shrink-0 group active:scale-95 transition-transform')}>
              <Avatar firstName={user.first_name} lastName={user.last_name} avatarUrl={user.avatar_url} />
              <span className={cn('font-medium group-hover:underline md:inline truncate max-w-[120px]')}>
                {getFullName(user.first_name, user.last_name)}
              </span>
            </Link>
          ) : (
            <div className={cn('hidden sm:block w-4')} />
          )}
        </div>

        {/* NÚT LOGOUT ADMIN */}
        <div className={cn('shrink-0 text-right sm:text-center sm:min-w-0')}>
          {/* THAY THẾ THẺ LINK CŨ BẰNG NÚT GỌI API LOGOUT CHUNG */}
          <LogoutButton />
        </div>
      </div>

      <div className={cn('w-full block sm:hidden')}>
        <input type="text" placeholder="Search Photo / Album" className={cn('w-full bg-surface text-text-primary px-4 py-1.5 rounded-xs text-sm focus:outline-none placeholder-text-muted shadow-inner focus:ring-2 focus:ring-accent/50 transition-all')} />
      </div>
    </nav>
  );
}