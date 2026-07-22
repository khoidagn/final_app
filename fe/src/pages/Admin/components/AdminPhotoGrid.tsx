import AdminPhotoCard from './AdminPhotoCard';
import type { PhotoData } from '../../../types/photo.type';
import type { AdminPhotoData } from '../../../types/admin.type';
import { cn } from '../../../utils/cn';

export type GeneralPhotoItem = PhotoData | AdminPhotoData;

interface AdminPhotoGridProps {
  photos: GeneralPhotoItem[];
  isDeleting?: boolean;
  onPreviewPhoto: (photo: GeneralPhotoItem) => void;
  onDeletePhoto: (id: number) => void;
  emptyMessage?: string;
}

export default function AdminPhotoGrid({
  photos,
  isDeleting,
  onPreviewPhoto,
  onDeletePhoto,
  emptyMessage = 'No photos found.',
}: AdminPhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className={cn('py-12 text-center text-xs text-text-muted')}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4',
        'sm:grid-cols-3',
        'lg:grid-cols-4'
      )}
    >
      {photos.map((photo) => (
        <AdminPhotoCard
          key={photo.id}
          id={photo.id}
          title={photo.title}
          imageUrl={photo.media?.imageUrl}
          isDeleting={isDeleting}
          onPreview={() => onPreviewPhoto(photo)}
          onDelete={onDeletePhoto}
        />
      ))}
    </div>
  );
}
