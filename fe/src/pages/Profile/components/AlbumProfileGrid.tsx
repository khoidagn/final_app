import React from 'react';
import type { ProfileCardData } from '../../../types/profile';
import { LockKeyhole } from 'lucide-react';
import EditButton from '../../../components/ui/EditButton';

interface AlbumProfileGridProps {
  items: ProfileCardData[];
  isOwnProfile: boolean;
}

export default function AlbumProfileGrid({
  items,
  isOwnProfile,
}: AlbumProfileGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col group min-w-0">
          <div className="w-full aspect-square bg-gray-100 rounded-md relative shadow-md border-2 border-white overflow-hidden shrink-0">
            <img
              src={item.image_url}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 text-white rounded-full flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold leading-none">
                {item.photos_count}
              </span>
              <span className="text-[7px] font-bold tracking-tight">
                PHOTOS
              </span>
            </div>

            {item.is_private && (
              <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full text-[10px]">
                <LockKeyhole size={14} strokeWidth={2} />
              </div>
            )}

            {isOwnProfile && <EditButton to={`/albums/${item.id}/edit`} />}
          </div>

          <span className="text-[11px] text-gray-500 mt-2 truncate text-center sm:text-left w-full block">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
}
