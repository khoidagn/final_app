import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50 md:sticky md:top-20 md:bottom-auto md:left-auto md:right-auto md:bg-transparent md:border-t-0 md:shadow-none md:w-36 ">
      <ul className="flex flex-row md:flex-col justify-around md:justify-start h-14 md:h-auto items-center md:items-stretch list-none p-0 m-0 gap-y-1">
        <li>
          <NavLink
            to="/feeds"
            className={({ isActive }) =>
              `block text-decoration-none transition-colors ${
                isActive
                  ? 'text-blue-900 font-bold border-b-2 border-blue-900 md:border-b-0 md:border-l-4 md:border-blue-900 pb-1 md:pb-0 md:pl-3'
                  : 'text-gray-500 hover:text-gray-800 md:pl-4'
              }`
            }
          >
            Feeds
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/discovery"
            className={({ isActive }) =>
              `block text-decoration-none transition-colors ${
                isActive
                  ? 'text-blue-900 font-bold border-b-2 border-blue-900 md:border-b-0 md:border-l-4 md:border-blue-900 pb-1 md:pb-0 md:pl-3'
                  : 'text-gray-500 hover:text-gray-800 md:pl-4'
              }`
            }
          >
            Discover
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
