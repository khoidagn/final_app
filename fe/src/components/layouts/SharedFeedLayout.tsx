import { useState } from 'react';
import FeedTabs from '../../pages/Feeds/components/FeedTabs';
import PhotoGrid from '../../pages/Feeds/components/PhotoGrid';
import AlbumGrid from '../../pages/Feeds/components/AlbumGrid';
import PhotoModal from '../../pages/Photos/PhotoModal';
import AlbumModal from '../../pages/Albums/AlbumModal';
import type { FeedTabType, PhotoData, AlbumData } from '../../types/feeds';
import { cn } from '../../utils/cn';

interface SharedFeedLayoutProps {
  photos: PhotoData[];
  albums: AlbumData[];
  isLoading?: boolean;
  activeTab: FeedTabType;
  onChangeTab: (tab: FeedTabType) => void;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
}

export default function SharedFeedLayout({
  photos,
  albums,
  isLoading,
  activeTab,
  onChangeTab,
  onFollowToggle,
}: SharedFeedLayoutProps) {
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

  const currentSelectedPhoto =
    photos.find((p) => p.id === selectedPhotoId) || null;
  const currentSelectedAlbum =
    albums.find((a) => a.id === selectedAlbumId) || null;

  return (
    <div
      className={cn(
        'w-full flex flex-col items-center pt-6 p-4',
        'bg-surface border border-border-default rounded-md shadow-xs'
      )}
    >
      <FeedTabs activeTab={activeTab} onChangeTab={onChangeTab} />

      {activeTab === 'photo' ? (
        <PhotoGrid
          photos={photos}
          onSelectPhoto={setSelectedPhotoId}
          onFollowToggle={onFollowToggle}
        />
      ) : (
        <AlbumGrid
          albums={albums}
          onSelectAlbum={setSelectedAlbumId}
          onFollowToggle={onFollowToggle}
        />
      )}

      {isLoading && (
        <div className={cn('mb-4')}>
          <div
            className={cn(
              'w-8 h-8 border-4 rounded-full animate-spin',
              'border-border-default border-t-brand'
            )}
          />
        </div>
      )}

      {selectedPhotoId && (
        <PhotoModal
          data={currentSelectedPhoto}
          onClose={() => setSelectedPhotoId(null)}
        />
      )}
      {selectedAlbumId && (
        <AlbumModal
          data={currentSelectedAlbum}
          onClose={() => setSelectedAlbumId(null)}
        />
      )}
    </div>
  );
}
