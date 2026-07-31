import type { AdminUserData } from '../../types/admin.type';
import { useAdminPagination } from './hooks/useAdminPagination';
import UserRowAction from './components/UserRowAction';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { cn } from '../../utils/cn';
import { formatDateTime } from '../../utils/date';

export default function AdminUsers() {
  const {
    dataList: users,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    resetCache,
  } = useAdminPagination<AdminUserData>({
    endpoint: 'admin/users',
    uiItemsPerPage: 10,
    bePagesPerBatch: 3,
  });

  if (isLoading) {
    return <LoadingSpinner minHeight="min-h-[500px]" />;
  }

  return (
    <div
      className={cn(
        'w-full min-h-[500px] flex flex-col justify-between p-3 sm:p-5 md:p-6',
        'bg-surface border-0 sm:border border-border-default rounded-none sm:rounded-md shadow-none sm:shadow-xs'
      )}
    >
      <div className={cn('w-full')}>
        {/* ================= CARDS VIEW (Mobile: 1 cột | iPad/Tablet: 2 cột) ================= */}
        <div
          className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:hidden')}
        >
          {users.map((user) => (
            <div
              key={user.id}
              className={cn(
                'p-3.5 rounded-md border border-border-default bg-background/40',
                'flex flex-col justify-between gap-3 shadow-3xs transition-all hover:border-brand/30'
              )}
            >
              <div className={cn('flex flex-col gap-2')}>
                <div className={cn('flex items-center justify-between gap-2')}>
                  <span
                    className={cn(
                      'font-bold text-xs text-text-primary truncate'
                    )}
                  >
                    {user.firstName} {user.lastName}
                  </span>

                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0',
                      user.isActive
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-danger/10 text-danger border border-danger/20'
                    )}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div
                  className={cn(
                    'flex flex-col gap-1.5 text-[11px] text-text-muted'
                  )}
                >
                  <div
                    className={cn('flex items-center justify-between gap-2')}
                  >
                    <span>Email:</span>
                    <span
                      className={cn(
                        'font-mono text-text-primary truncate max-w-[180px]'
                      )}
                      title={user.email}
                    >
                      {user.email}
                    </span>
                  </div>

                  <div
                    className={cn('flex items-center justify-between gap-2')}
                  >
                    <span>Last login:</span>
                    <span className={cn('font-mono text-text-secondary')}>
                      {formatDateTime(user.lastLogin)}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  'pt-2 border-t border-border-muted flex items-center justify-end'
                )}
              >
                <UserRowAction
                  userId={user.id}
                  email={user.email}
                  onActionSuccess={resetCache}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP VIEW (>= lg: 1024px) ================= */}
        <div className={cn('hidden lg:block w-full overflow-x-auto')}>
          <table
            className={cn('w-full text-left border-collapse min-w-[650px]')}
          >
            <thead>
              <tr
                className={cn(
                  'border-b text-xs font-bold text-text-primary border-border-default'
                )}
              >
                <th className={cn('pb-3 w-1/6')}>First Name</th>
                <th className={cn('pb-3 w-1/6')}>Last Name</th>
                <th className={cn('pb-3 w-2/6')}>Email</th>
                <th className={cn('pb-3 text-center w-10')}>Status</th>
                <th className={cn('pb-3 text-center w-1/6')}>Last login</th>
                <th className={cn('pb-3 text-center w-24')}>Actions</th>
              </tr>
            </thead>
            <tbody
              className={cn(
                'divide-y text-xs text-text-primary divide-border-muted'
              )}
            >
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={cn('hover:bg-background transition-colors')}
                >
                  <td className={cn('py-3.5 font-medium')}>{user.firstName}</td>
                  <td className={cn('py-3.5 font-medium')}>{user.lastName}</td>
                  <td className={cn('py-3.5 font-mono')}>{user.email}</td>

                  <td className={cn('py-3.5 text-center')}>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold shadow-3xs',
                        user.isActive
                          ? 'bg-success/10 text-success border border-success/20'
                          : 'bg-danger/10 text-danger border border-danger/20'
                      )}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className={cn('py-3.5 text-center font-mono')}>
                    {formatDateTime(user.lastLogin)}
                  </td>

                  <td className={cn('py-3.5 text-center')}>
                    <UserRowAction
                      userId={user.id}
                      email={user.email}
                      onActionSuccess={resetCache}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={cn('mt-4')}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
