import React from 'react';
import { Link } from 'react-router-dom';
import type { AdminPhotoData } from '../../types/admin';
import { useAdminPagination } from '../../hooks/useAdminPagination';
import Pagination from '../../components/ui/Pagination';
import { SquarePen } from 'lucide-react';
import { cn } from '../../utils/cn';

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
        'w-full min-h-125 flex flex-col justify-between p-6',
        'bg-surface border border-border-default rounded-md shadow-xs'
      )}
    >
      <div
        className={cn(
          'grid grid-cols-2 gap-4',
          'sm:grid-cols-3',
          'lg:grid-cols-4'
        )}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={cn(
              'w-full aspect-square relative rounded-sm overflow-hidden shrink-0 select-none group',
              'bg-background border border-border-default shadow-2xs'
            )}
          >
            <img
              src={photo.image_url}
              alt={photo.title}
              className={cn('absolute inset-0 w-full h-full object-cover')}
            />

            <div
              className={cn(
                'absolute top-0 left-0 right-0 bg-black/40 text-white px-2 py-1.5 flex items-center justify-between z-10'
              )}
            >
              <span
                className={cn(
                  'text-[10px] truncate pr-2 font-medium w-full block text-left'
                )}
              >
                {photo.title}
              </span>
              <Link
                to={`/admin/photos/${photo.id}/edit`}
                className={cn(
                  'text-white hover:text-white/80 shrink-0',
                  'active:scale-90 transform transition-transform'
                )}
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
