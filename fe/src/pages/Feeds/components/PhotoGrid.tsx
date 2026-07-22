import PhotoCard from './PhotoCard';
import type { PhotoData } from '../../../types/photo.type';
import { cn } from '../../../utils/cn';

interface PhotoGridProps {
  photos: PhotoData[];
  onSelectPhoto: (id: number) => void;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
  onLikeToggle?: (type: 'photo' | 'album', id: number) => void;
  hideFollowButton?: boolean;
}

export default function PhotoGrid({
  photos,
  onSelectPhoto,
  onFollowToggle,
  onLikeToggle,
  hideFollowButton = false,
}: PhotoGridProps) {
  return (
    <div
      className={cn(
        'w-full mb-6 sm:mb-10',
        'grid grid-cols-1 gap-1 sm:gap-6',
        'lg:grid-cols-2'
      )}
    >
      {photos.map((photo) => (
        <div key={photo.id} className={cn('w-full')}>
          <PhotoCard
            data={photo}
            onFollowToggle={onFollowToggle}
            onCardClick={() => onSelectPhoto(photo.id)}
            onLikeToggle={onLikeToggle}
            hideFollowButton={hideFollowButton}
          />
        </div>
      ))}
    </div>
  );
}
