import AlbumCard from './AlbumCard';
import type { AlbumData } from '../../../types/album.type';
import { cn } from '../../../utils/cn';

interface AlbumGridProps {
  albums: AlbumData[];
  onSelectAlbum: (id: number) => void;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
  onLikeToggle?: (type: 'photo' | 'album', id: number) => void;
  hideFollowButton?: boolean;
}

export default function AlbumGrid({
  albums,
  onSelectAlbum,
  onFollowToggle,
  onLikeToggle,
  hideFollowButton = false,
}: AlbumGridProps) {
  return (
    <div
      className={cn(
        'w-full mb-6 sm:mb-10',
        'grid grid-cols-1 gap-1 sm:gap-6',
        'lg:grid-cols-2'
      )}
    >
      {albums.map((album) => (
        <div key={album.id} className={cn('w-full')}>
          <AlbumCard
            data={album}
            onFollowToggle={onFollowToggle}
            onCardClick={() => onSelectAlbum(album.id)}
            onLikeToggle={onLikeToggle}
            hideFollowButton={hideFollowButton}
          />
        </div>
      ))}
    </div>
  );
}
