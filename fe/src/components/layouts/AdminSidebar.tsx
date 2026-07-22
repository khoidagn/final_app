import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

function AdminSidebar() {
  return (
    <aside
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-surface border-t border-border-default shadow-[0_-4px_12px_rgba(0,0,0,0.05)]',
        'md:sticky md:top-20 md:bottom-auto md:left-auto md:right-auto md:w-36',
        'md:bg-transparent md:border-t-0 md:shadow-none'
      )}
    >
      <ul
        className={cn(
          'list-none p-0 m-0 gap-y-1',
          'flex flex-row md:flex-col',
          'justify-around md:justify-start items-center md:items-stretch',
          'h-14 md:h-auto'
        )}
      >
        <li>
          <NavLink
            to="/admin/photos"
            className={({ isActive }) =>
              cn(
                'block text-decoration-none transition-colors py-2 text-sm',
                isActive
                  ? 'text-brand font-bold border-b-2 border-brand pb-1.5 md:pb-2 md:border-b-0 md:border-l-4 md:border-brand md:pl-3'
                  : 'text-text-secondary hover:text-text-primary md:pl-4',
                'active:scale-98 transform duration-75'
              )
            }
          >
            Manage Photos
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/albums"
            className={({ isActive }) =>
              cn(
                'block text-decoration-none transition-colors py-2 text-sm',
                isActive
                  ? 'text-brand font-bold border-b-2 border-brand pb-1.5 md:pb-2 md:border-b-0 md:border-l-4 md:border-brand md:pl-3'
                  : 'text-text-secondary hover:text-text-primary md:pl-4',
                'active:scale-98 transform duration-75'
              )
            }
          >
            Manage Albums
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              cn(
                'block text-decoration-none transition-colors py-2 text-sm',
                isActive
                  ? 'text-brand font-bold border-b-2 border-brand pb-1.5 md:pb-2 md:border-b-0 md:border-l-4 md:border-brand md:pl-3'
                  : 'text-text-secondary hover:text-text-primary md:pl-4',
                'active:scale-98 transform duration-75'
              )
            }
          >
            Manage Users
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
