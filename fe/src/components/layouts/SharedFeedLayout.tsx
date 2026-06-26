import { useState } from 'react';
import FeedTabs from '../../pages/Feeds/components/FeedTabs';
import PhotoGrid from '../../pages/Feeds/components/PhotoGrid';
import AlbumGrid from '../../pages/Feeds/components/AlbumGrid';
import PhotoModal from '../../pages/Photos/PhotoModal';
import AlbumModal from '../../pages/Albums/AlbumModal';
import type { FeedTabType, PhotoData, AlbumData } from '../../types/feeds';

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
    <div className="bg-white rounded-md shadow-sm border border-gray-100 pt-6 p-4 flex flex-col items-center w-full">
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
        <div className="mb-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-900 rounded-full animate-spin"></div>
        </div>
      )}

      {selectedPhotoId !== null && (
        <PhotoModal
          data={currentSelectedPhoto}
          onClose={() => setSelectedPhotoId(null)}
        />
      )}
      {selectedAlbumId !== null && (
        <AlbumModal
          data={currentSelectedAlbum}
          onClose={() => setSelectedAlbumId(null)}
        />
      )}
    </div>
  );
}
