import { useState } from 'react';
import FeedTabs from '../../pages/Feeds/components/FeedTabs';
import PhotoGrid from '../../pages/Feeds/components/PhotoGrid';
import AlbumGrid from '../../pages/Feeds/components/AlbumGrid';
import PhotoModal from '../../pages/Photos/PhotoModal';
import AlbumModal from '../../pages/Albums/AlbumModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { FeedTabType } from '../../types/feeds.type';
import type { PhotoData } from '../../types/photo.type';
import type { AlbumData } from '../../types/album.type';
import { cn } from '../../utils/cn';

interface SharedFeedLayoutProps {
  photos: PhotoData[];
  albums: AlbumData[];
  isLoading?: boolean;
  activeTab: FeedTabType;
  onChangeTab: (tab: FeedTabType) => void;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
  onLikeToggle?: (type: 'photo' | 'album', id: number) => void;
  hideFollowButton?: boolean;
}

export default function SharedFeedLayout({
  photos,
  albums,
  isLoading,
  activeTab,
  onChangeTab,
  onFollowToggle,
  onLikeToggle,
  hideFollowButton = false,
}: SharedFeedLayoutProps) {
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

  const currentSelectedPhoto = Array.isArray(photos)
    ? photos.find((p) => p.id === selectedPhotoId) || null
    : null;

  const currentSelectedAlbum = Array.isArray(albums)
    ? albums.find((a) => a.id === selectedAlbumId) || null
    : null;

  const currentAlbumImageUrls =
    (currentSelectedAlbum?.albumMedias
      ?.map((item) => item.media?.imageUrl)
      .filter(Boolean) as string[]) || [];

  return (
    <div
      className={cn(
        'w-full flex flex-col items-center',
        'pt-4 pb-4 px-0 sm:p-6',
        'bg-surface',
        'border-0 sm:border sm:border-border-default rounded-none sm:rounded-md shadow-none sm:shadow-xs'
      )}
    >
      <FeedTabs activeTab={activeTab} onChangeTab={onChangeTab} />

      {activeTab === 'photo' ? (
        <PhotoGrid
          photos={photos}
          onSelectPhoto={setSelectedPhotoId}
          onFollowToggle={onFollowToggle}
          onLikeToggle={onLikeToggle}
          hideFollowButton={hideFollowButton}
        />
      ) : (
        <AlbumGrid
          albums={albums}
          onSelectAlbum={setSelectedAlbumId}
          onFollowToggle={onFollowToggle}
          onLikeToggle={onLikeToggle}
          hideFollowButton={hideFollowButton}
        />
      )}

      {isLoading && <LoadingSpinner />}

      <PhotoModal
        isOpen={selectedPhotoId !== null && currentSelectedPhoto !== null}
        title={currentSelectedPhoto?.title || ''}
        description={currentSelectedPhoto?.description}
        imageUrl={currentSelectedPhoto?.media?.imageUrl || ''}
        onClose={() => setSelectedPhotoId(null)}
      />

      {selectedAlbumId && currentSelectedAlbum && (
        <AlbumModal
          isOpen={selectedAlbumId !== null && currentSelectedAlbum !== null}
          title={currentSelectedAlbum?.title || ''}
          description={currentSelectedAlbum?.description}
          imageUrls={currentAlbumImageUrls}
          onClose={() => setSelectedAlbumId(null)}
        />
      )}
    </div>
  );
}
