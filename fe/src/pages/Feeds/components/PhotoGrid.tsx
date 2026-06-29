import React from 'react';
import PhotoCard from './PhotoCard';
import type { PhotoData } from '../../../types/feeds';
import { cn } from '../../../utils/cn';

interface PhotoGridProps {
  photos: PhotoData[];
  onSelectPhoto: (id: number) => void;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
}

export default function PhotoGrid({
  photos,
  onSelectPhoto,
  onFollowToggle,
}: PhotoGridProps) {
  return (
    <div
      className={cn('w-full mb-10 grid grid-cols-1 gap-6', 'lg:grid-cols-2')}
    >
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          data={photo}
          onFollowToggle={onFollowToggle}
          onCardClick={() => onSelectPhoto(photo.id)}
        />
      ))}
    </div>
  );
}
