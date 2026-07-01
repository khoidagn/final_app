import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { AdminUserData } from '../../types/admin';
import { useAdminPagination } from '../../hooks/useAdminPagination';
import Pagination from '../../components/ui/Pagination';
import { cn } from '../../utils/cn';

export default function AdminUsers() {
  const navigate = useNavigate();

  const {
    dataList: users,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
  } = useAdminPagination<AdminUserData>({
    endpoint: 'admin_users',
    itemsPerPage: 40,
  });

  if (isLoading) {
    return (
      <div
        className={cn(
          'w-full min-h-[500px] flex items-center justify-center p-6',
          'bg-surface border border-border-default rounded-md'
        )}
      >
        <div
          className={cn(
            'w-8 h-8 border-4 rounded-full animate-spin',
            'border-border-default border-t-brand'
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full min-h-[500px] flex flex-col justify-between p-6',
        'bg-surface border border-border-default rounded-md shadow-xs'
      )}
    >
      <div className={cn('w-full overflow-x-auto')}>
        <table className={cn('w-full text-left border-collapse min-w-[600px]')}>
          <thead>
            <tr
              className={cn(
                'border-b text-xs font-bold text-text-primary border-border-default'
              )}
            >
              <th className={cn('pb-3 w-1/5')}>First Name</th>
              <th className={cn('pb-3 w-1/5')}>Last Name</th>
              <th className={cn('pb-3 w-2/5')}>Email</th>
              <th className={cn('pb-3 w-1/5')}>Last login</th>
              <th className={cn('pb-3 text-center w-24')}>Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn(
              'divide-y text-xs text-text-secondary divide-border-muted'
            )}
          >
            {users.map((user) => (
              <tr
                key={user.id}
                className={cn('hover:bg-background transition-colors')}
              >
                <td className={cn('py-3.5 font-medium text-text-primary')}>
                  {user.first_name}
                </td>
                <td className={cn('py-3.5')}>{user.last_name}</td>
                <td className={cn('py-3.5 font-mono text-text-muted')}>
                  {user.email}
                </td>
                <td className={cn('py-3.5 text-text-muted')}>
                  {user.last_login}
                </td>
                <td
                  className={cn(
                    'py-3.5 text-center flex items-center justify-center gap-1.5'
                  )}
                >
                  <button
                    onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                    className={cn(
                      'text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-2xs cursor-pointer focus:outline-none',
                      'bg-success hover:bg-success-hover',
                      'active:scale-95 transform transition-transform'
                    )}
                  >
                    Edit
                  </button>
                  <button
                    className={cn(
                      'text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-2xs cursor-pointer focus:outline-none',
                      'bg-danger hover:bg-danger-hover',
                      'active:scale-95 transform transition-transform'
                    )}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
