import React from 'react';
import type { ProfileCardData } from '../../../types/profile';
import { LockKeyhole } from 'lucide-react';
import EditButton from '../../../components/ui/EditButton';
import { cn } from '../../../utils/cn';

interface AlbumProfileGridProps {
  items: ProfileCardData[];
  isOwnProfile: boolean;
}

export default function AlbumProfileGrid({
  items,
  isOwnProfile,
}: AlbumProfileGridProps) {
  return (
    <div className={cn('w-full grid grid-cols-2 gap-6', 'md:grid-cols-4')}>
      {items.map((item) => (
        <div key={item.id} className={cn('flex flex-col min-w-0 group')}>
          <div
            className={cn(
              'w-full aspect-square relative rounded-md overflow-hidden shrink-0 border-2 shadow-sm',
              'bg-background border-surface'
            )}
          >
            <img
              src={item.image_url}
              alt={item.title}
              className={cn('absolute inset-0 w-full h-full object-cover')}
            />

            <div
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 text-white rounded-full flex flex-col items-center justify-center text-center select-none'
              )}
            >
              <span className={cn('text-xs font-bold leading-none')}>
                {item.photos_count}
              </span>
              <span
                className={cn('text-[7px] font-bold tracking-tight mt-0.5')}
              >
                PHOTOS
              </span>
            </div>

            {item.is_private && (
              <div
                className={cn(
                  'absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full text-[10px]'
                )}
              >
                <LockKeyhole size={14} strokeWidth={2} />
              </div>
            )}

            {isOwnProfile && <EditButton to={`/albums/${item.id}/edit`} />}
          </div>

          <span
            className={cn(
              'text-[11px] mt-2 truncate text-center w-full block text-text-secondary'
            )}
          >
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
}
