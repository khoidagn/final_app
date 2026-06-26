import React from 'react';
import type { AdminUserData } from '../../types/admin';
import { useAdminPagination } from '../../hooks/useAdminPagination';
import Pagination from '../../components/ui/Pagination';

export default function AdminUsers() {
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
      <div className="bg-white rounded-md border border-gray-100 p-6 w-full min-h-[500px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md border border-gray-100 p-6 w-full min-h-[500px] flex flex-col justify-between">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-bold text-gray-800">
              <th className="pb-3 w-1/5">First Name</th>
              <th className="pb-3 w-1/5">Last Name</th>
              <th className="pb-3 w-2/5">Email</th>
              <th className="pb-3 w-1/5">Last login</th>
              <th className="pb-3 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100 transition-colors">
                <td className="py-3.5 font-medium">{user.first_name}</td>
                <td className="py-3.5">{user.last_name}</td>
                <td className="py-3.5 font-mono text-gray-600">{user.email}</td>
                <td className="py-3.5 text-gray-500">{user.last_login}</td>
                <td className="py-3.5 text-center flex items-center justify-center gap-1.5">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-2xs cursor-pointer focus:outline-none">
                    Edit
                  </button>
                  <button className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-2xs cursor-pointer focus:outline-none">
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
