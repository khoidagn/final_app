import React from 'react';
import { Link } from 'react-router-dom';
import type { AdminAlbumData } from '../../types/admin';
import { useAdminPagination } from '../../hooks/useAdminPagination';
import Pagination from '../../components/Pagination'; 
import { SquarePen } from 'lucide-react';

export default function AdminAlbums() {
  const { dataList: albums, currentPage, setCurrentPage, totalPages, isLoading } = 
    useAdminPagination<AdminAlbumData>({ endpoint: 'admin_albums', itemsPerPage: 40 });

  if (isLoading) {
    return (
      <div className="bg-white rounded-md border border-gray-100 p-6 w-full min-h-[500px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md border border-gray-100 p-6 w-full min-h-[500px] flex flex-col justify-between">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
        {albums.map((album) => (
          <div key={album.id} className="aspect-square w-full relative flex items-center justify-center bg-gray-50/20 select-none">
            <div className="absolute w-[82%] h-[82%] rounded-xs bg-gray-200 border border-white transform rotate-12  opacity-40 shadow-2xs"></div>
            <div className="absolute w-[82%] h-[82%] rounded-xs bg-gray-300 border border-white transform rotate-6  opacity-75 shadow-2xs"></div>
            
            <div className="absolute w-[85%] h-[85%] rounded-xs overflow-hidden shadow-sm border-2 border-white transform -rotate-1 z-10">
              <img 
                src={album.image_url} 
                alt={album.title} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              
              <div className="absolute top-0 left-0 right-0 bg-black/40 text-white px-2 py-1.5 flex items-center justify-between z-20">
                <span className="text-[10px] truncate pr-2 font-medium w-full block text-left">
                  {album.title}
                </span>
                <Link to={`/albums/${album.id}/edit`} className="text-white hover:text-gray-200 shrink-0">
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
  
  
