import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
import Avatar from './Avatar';
import { getFullName } from '../utils/string';

export default function AdminNavbar() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <nav className="bg-blue-900 h-11 w-full sticky top-0 z-50 shadow-sm"></nav>;
  }

  return (
    <nav className="bg-blue-900 text-white px-6 py-2 grid grid-cols-[120px_1fr_120px] gap-6 items-center shadow-sm sticky top-0 z-50">      
      <div className="min-w-0">
        <Link to="/admin" className="text-sm font-bold tracking-wide text-white text-decoration-none block truncate">
          Fotobook Admin
        </Link>
      </div>

      <div className="flex items-center justify-between w-full min-w-0">
        <div className="w-full max-w-xl hidden sm:block">
          <input 
            type="text" 
            placeholder="Search Photo / Album" 
            className="w-full bg-white text-gray-800 px-4 py-1.5 rounded-xs text-sm focus:outline-none placeholder-gray-400"
          />
        </div>

        {user && (
          <Link to="/my-profile/edit" className="flex items-center space-x-2 text-white text-decoration-none shrink-0 ml-4 group">
            <Avatar 
              firstName={user.first_name}
              lastName={user.last_name}
              avatarUrl={user.avatar_url}
              sizeClass="w-8 h-8"
              textSizeClass="text-xs"
              bgColorClass="bg-white"
              textColorClass="text-blue-900"
            />
            <span className="font-medium group-hover:underline hidden md:inline max-w-[120px] truncate">
              {getFullName(user.first_name, user.last_name)}
            </span>
          </Link>
        )}
      </div>

      <div className="text-center min-w-0">
        <Link to="/login" className="text-gray-200 hover:text-white hover:underline transition-colors text-decoration-none text-sm font-medium">
          Logout
        </Link>
      </div>
    </nav>
  );
}