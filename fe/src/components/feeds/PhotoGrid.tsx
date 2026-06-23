import PhotoCard from './PhotoCard';
import type { PhotoData } from '../../types/feeds';

interface PhotoGridProps {
  photos: PhotoData[];
  onSelectPhoto: (id: number) => void;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
}

export default function PhotoGrid({ photos, onSelectPhoto, onFollowToggle }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-10">
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          onClick={() => onSelectPhoto(photo.id)} 
          className="cursor-pointer"
        >
          <PhotoCard data={photo} onFollowToggle={onFollowToggle} />
        </div>
      ))}
    </div>
  );
}