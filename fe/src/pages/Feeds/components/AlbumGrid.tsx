import AlbumCard from './AlbumCard';
import type { AlbumData } from '../../../types/feeds';

interface AlbumGridProps {
  albums: AlbumData[];
  onSelectAlbum: (id: number) => void;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
}

export default function AlbumGrid({
  albums,
  onSelectAlbum,
  onFollowToggle,
}: AlbumGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-10">
      {albums.map((album) => (
        <div
          key={album.id}
          onClick={() => onSelectAlbum(album.id)}
          className="cursor-pointer"
        >
          <AlbumCard data={album} onFollowToggle={onFollowToggle} />
        </div>
      ))}
    </div>
  );
}
