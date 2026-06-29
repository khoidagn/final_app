import React from 'react';
import { Link } from 'react-router-dom';
import type { AdminAlbumData } from '../../types/admin';
import { useAdminPagination } from '../../hooks/useAdminPagination';
import Pagination from '../../components/ui/Pagination';
import { SquarePen } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function AdminAlbums() {
  const {
    dataList: albums,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
  } = useAdminPagination<AdminAlbumData>({
    endpoint: 'admin_albums',
    itemsPerPage: 40,
  });

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full min-h-[500px] flex items-center justify-center p-6",
          "bg-surface border border-border-default rounded-md"
        )}
      >
        <div
          className={cn(
            "w-8 h-8 border-4 rounded-full animate-spin",
            "border-border-default border-t-brand"
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full min-h-[500px] flex flex-col justify-between p-6",
        "bg-surface border border-border-default rounded-md shadow-xs"
      )}
    >
      <div
        className={cn(
          "grid grid-cols-2 gap-x-4 gap-y-6",
          "sm:grid-cols-3",
          "lg:grid-cols-4"
        )}
      >
        {albums.map((album) => (
          <div
            key={album.id}
            className={cn(
              "aspect-square w-full relative flex items-center justify-center select-none",
              "bg-background/20"
            )}
          >
            <div
              className={cn(
                "absolute w-[82%] h-[82%] rounded-xs bg-border-default border border-surface shadow-2xs opacity-40",
                "transform rotate-12"
              )}
            />
            <div
              className={cn(
                "absolute w-[82%] h-[82%] rounded-xs bg-text-muted border border-surface shadow-2xs opacity-75",
                "transform rotate-6"
              )}
            />
            <div
              className={cn(
                "absolute w-[85%] h-[85%] rounded-xs overflow-hidden shadow-sm border-2 border-surface z-10",
                "transform -rotate-1"
              )}
            >
              <img
                src={album.image_url}
                alt={album.title}
                className={cn("absolute inset-0 w-full h-full object-cover")}
              />
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 bg-black/40 text-white px-2 py-1.5 flex items-center justify-between z-20"
                )}
              >
                <span className={cn("text-[10px] truncate pr-2 font-medium w-full block text-left")}>
                  {album.title}
                </span>
                <Link
                  to={`/admin/albums/${album.id}/edit`} 
                  className={cn(
                    "text-white hover:text-white/80 shrink-0",
                    "active:scale-90 transform transition-transform" 
                  )}
                >
                  <SquarePen size={16} strokeWidth={1.25} />
                </Link>
              </div>
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