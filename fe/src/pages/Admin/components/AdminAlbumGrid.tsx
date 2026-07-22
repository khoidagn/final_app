import AdminAlbumCard from './AdminAlbumCard';
import type { AlbumData } from '../../../types/album.type';
import type { AdminAlbumData } from '../../../types/admin.type';
import { cn } from '../../../utils/cn';

export type GeneralAlbumItem = AlbumData | AdminAlbumData;

interface AdminAlbumGridProps {
  albums: GeneralAlbumItem[];
  isDeleting?: boolean;
  onPreviewAlbum: (album: GeneralAlbumItem) => void;
  onDeleteAlbum: (id: number, title: string) => void;
  emptyMessage?: string;
}

export default function AdminAlbumGrid({
  albums,
  isDeleting,
  onPreviewAlbum,
  onDeleteAlbum,
  emptyMessage = 'No albums found.',
}: AdminAlbumGridProps) {
  if (albums.length === 0) {
    return (
      <div className={cn('py-12 text-center text-xs text-text-muted')}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-6',
        'sm:grid-cols-3',
        'lg:grid-cols-4'
      )}
    >
      {albums.map((album) => {
        const coverImageUrl =
          album.albumMedias && album.albumMedias.length > 0
            ? album.albumMedias[0].media?.imageUrl
            : '/default-album.jpg';

        return (
          <AdminAlbumCard
            key={album.id}
            id={album.id}
            title={album.title}
            coverImageUrl={coverImageUrl}
            isDeleting={isDeleting}
            onPreview={() => onPreviewAlbum(album)}
            onDelete={onDeleteAlbum}
          />
        );
      })}
    </div>
  );
}
