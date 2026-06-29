import React from 'react';
import type { ProfileCardData } from '../../../types/profile';
import { LockKeyhole } from 'lucide-react';
import EditButton from '../../../components/ui/EditButton';
import { cn } from '../../../utils/cn';

interface PhotoProfileGridProps {
  items: ProfileCardData[];
  isOwnProfile: boolean;
}

export default function PhotoProfileGrid({
  items,
  isOwnProfile,
}: PhotoProfileGridProps) {
  return (
    <div className={cn('w-full grid grid-cols-2 gap-6', 'md:grid-cols-4')}>
      {items.map((item) => (
        <div key={item.id} className={cn('flex flex-col min-w-0 group')}>
          <div
            className={cn(
              'aspect-square overflow-hidden relative shadow-2xs rounded-md border',
              'bg-background border-border-default'
            )}
          >
            <img
              src={item.image_url}
              alt={item.title}
              className={cn('w-full h-full object-cover')}
            />

            {item.is_private && (
              <div
                className={cn(
                  'absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full text-[10px]'
                )}
              >
                <LockKeyhole size={16} strokeWidth={1} />
              </div>
            )}

            {isOwnProfile && <EditButton to={`/photos/${item.id}/edit`} />}
          </div>

          <span
            className={cn(
              'text-[11px] mt-1.5 truncate text-center text-text-secondary'
            )}
          >
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
}
