import { LockKeyhole } from 'lucide-react';
import EditButton from '../../../components/ui/EditButton';
import { cn } from '../../../utils/cn';
import type { PhotoData } from '../../../types/photo.type';
import { SharingMode } from '../../../types/enum.type';

interface PhotoProfileGridProps {
  items: PhotoData[];
  isOwnProfile: boolean;
  onItemClick?: (item: PhotoData) => void;
}

export default function PhotoProfileGrid({
  items,
  isOwnProfile,
  onItemClick,
}: PhotoProfileGridProps) {
  return (
    <div className={cn('w-full grid grid-cols-2 gap-6', 'md:grid-cols-4')}>
      {items.map((item) => {
        const displayImageUrl = item.media?.imageUrl || '/placeholder.jpg';
        const isPrivate = item.sharingMode === SharingMode.PRIVATE || false;

        return (
          <div
            key={item.id}
            className={cn('flex flex-col min-w-0 group cursor-pointer')}
            onClick={() => onItemClick?.(item)}
          >
            <div
              className={cn(
                'aspect-square overflow-hidden relative shadow-2xs rounded-md border',
                'bg-background border-border-default'
              )}
            >
              <img
                src={displayImageUrl}
                alt={item.title}
                className={cn('w-full h-full object-cover')}
              />

              {isPrivate && (
                <div
                  className={cn(
                    'absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full text-[10px]'
                  )}
                >
                  <LockKeyhole size={16} strokeWidth={1} />
                </div>
              )}

              {isOwnProfile && (
                <div onClick={(e) => e.stopPropagation()}>
                  <EditButton to={`/photos/${item.id}/edit`} />
                </div>
              )}
            </div>
            <span
              className={cn(
                'text-[11px] mt-1.5 truncate text-center text-text-secondary'
              )}
            >
              {item.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
