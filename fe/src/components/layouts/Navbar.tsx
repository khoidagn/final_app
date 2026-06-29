import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import { getFullName } from '../../utils/string';
import { cn } from '../../utils/cn';

export default function Navbar() {
  const { isLoggedIn, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className={cn('bg-brand h-14 w-full sticky top-0 z-50 shadow-sm')} />
    );
  }

  return (
    <nav
      className={cn(
        'bg-brand text-white shadow-sm sticky top-0 z-50',
        'p-3 flex flex-col gap-3',
        'sm:py-2 sm:px-6'
      )}
    >
      <div
        className={cn(
          'w-full flex flex-row gap-2 items-center justify-between',
          'sm:grid sm:grid-cols-[120px_1fr_120px] sm:gap-6'
        )}
      >
        <div className={cn('shrink-0 sm:min-w-0')}>
          <Link
            to="/"
            className={cn(
              'text-xl font-bold tracking-wide text-white text-decoration-none block truncate',
              'active:scale-98 transition-transform'
            )}
          >
            Fotobook
          </Link>
        </div>

        <div
          className={cn(
            'flex flex-row items-center justify-end flex-1 min-w-0',
            'sm:justify-between'
          )}
        >
          <div className={cn('hidden sm:block w-full max-w-xl mr-4')}>
            <input
              type="text"
              placeholder="Search Photo / Album"
              className={cn(
                'w-full bg-surface text-text-primary px-4 py-1.5 rounded-xs text-sm focus:outline-none placeholder-text-muted shadow-inner',
                'focus:ring-2 focus:ring-accent/50 transition-all'
              )}
            />
          </div>

          {isLoggedIn && user ? (
            <Link
              to="/my-profile"
              className={cn(
                'flex items-center space-x-2 text-white text-decoration-none shrink-0 group',
                'active:scale-98 transition-transform'
              )}
            >
              <Avatar
                firstName={user.first_name}
                lastName={user.last_name}
                avatarUrl={user.avatar_url}
              />
              <span
                className={cn(
                  'font-medium group-hover:underline md:inline truncate max-w-[120px]'
                )}
              >
                {getFullName(user.first_name, user.last_name)}
              </span>
            </Link>
          ) : (
            <div className={cn('hidden sm:block w-4')} />
          )}
        </div>

        <div className={cn('shrink-0 text-right sm:text-center sm:min-w-0')}>
          {isLoggedIn ? (
            <Link
              to="/login"
              className={cn(
                'text-white/80 hover:text-white hover:underline transition-colors text-decoration-none text-sm font-medium',
                'active:scale-95 transform transition-transform'
              )}
            >
              Logout
            </Link>
          ) : (
            <Link
              to="/login"
              className={cn(
                'block text-center text-decoration-none text-sm font-bold transition-all transform rounded-xs shadow-2xs',
                'bg-accent hover:bg-accent-hover text-white',
                'px-3 py-1 sm:py-1.5',
                'active:scale-95'
              )}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <div className={cn('w-full block sm:hidden')}>
        <input
          type="text"
          placeholder="Search Photo / Album"
          className={cn(
            'w-full bg-surface text-text-primary px-4 py-1.5 rounded-xs text-sm focus:outline-none placeholder-text-muted shadow-inner',
            'focus:ring-2 focus:ring-accent/50 transition-all'
          )}
        />
      </div>
    </nav>
  );
}
