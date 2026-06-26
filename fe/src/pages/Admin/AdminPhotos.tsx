import React from 'react';
import { Link } from 'react-router-dom';
import type { AdminPhotoData } from '../../types/admin';
import { useAdminPagination } from '../../hooks/useAdminPagination';
import Pagination from '../../components/ui/Pagination';
import { SquarePen } from 'lucide-react';

export default function AdminPhotos() {
  const {
    dataList: photos,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
  } = useAdminPagination<AdminPhotoData>({
    endpoint: 'admin_photos',
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
    <div className="bg-white rounded-md border border-gray-100 p-6 w-full min-h-125 flex flex-col justify-between">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="w-full aspect-square bg-gray-100 rounded-sm relative border border-gray-200 shadow-2xs group overflow-hidden shrink-0"
          >
            <img
              src={photo.image_url}
              alt={photo.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bg-black/40 text-white px-2 py-1.5 flex items-center justify-between select-none z-10">
              <span className="text-[10px] truncate pr-2 font-medium w-full block text-left">
                {photo.title}
              </span>
              <Link
                to={`/photos/${photo.id}/edit`}
                className="text-white hover:text-gray-200 shrink-0"
              >
                <SquarePen size={16} strokeWidth={1.25} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
