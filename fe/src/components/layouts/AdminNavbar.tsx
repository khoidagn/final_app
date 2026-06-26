import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import { getFullName } from '../../utils/string';

export default function AdminNavbar() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className="bg-blue-900 h-14 w-full sticky top-0 z-50 shadow-sm"></nav>
    );
  }

  return (
    <nav className="bg-blue-900 text-white p-3 sm:py-2 sm:px-6 flex flex-col gap-3 shadow-sm sticky top-0 z-50">
      <div className="w-full flex flex-row gap-2 items-center justify-between sm:grid sm:grid-cols-[120px_1fr_120px] sm:gap-6">
        <div className="shrink-0 sm:min-w-0">
          <Link
            to="/admin"
            className="text-sm font-bold tracking-wide text-white text-decoration-none block truncate"
          >
            Fotobook Admin
          </Link>
        </div>

        <div className="flex flex-row items-center justify-end sm:justify-between flex-1 sm:min-w-0">
          <div className="hidden sm:block w-full max-w-xl mr-4">
            <input
              type="text"
              placeholder="Search Photo / Album"
              className="w-full bg-white text-gray-800 px-4 py-1.5 rounded-xs text-sm focus:outline-none placeholder-gray-400 shadow-inner"
            />
          </div>

          {user ? (
            <Link
              to="/my-profile/edit"
              className="flex items-center space-x-2 text-white text-decoration-none shrink-0 group"
            >
              <Avatar
                firstName={user.first_name}
                lastName={user.last_name}
                avatarUrl={user.avatar_url}
              />
              <span className="font-medium group-hover:underline md:inline truncate max-w-[120px]">
                {getFullName(user.first_name, user.last_name)}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block w-4"></div>
          )}
        </div>

        <div className="shrink-0 text-right sm:text-center sm:min-w-0">
          <Link
            to="/login"
            className="text-gray-200 hover:text-white hover:underline transition-colors text-decoration-none text-sm font-medium"
          >
            Logout
          </Link>
        </div>
      </div>

      <div className="w-full block sm:hidden">
        <input
          type="text"
          placeholder="Search Photo / Album"
          className="w-full bg-white text-gray-800 px-4 py-1.5 rounded-xs text-sm focus:outline-none placeholder-gray-400 shadow-inner"
        />
      </div>
    </nav>
  );
}
