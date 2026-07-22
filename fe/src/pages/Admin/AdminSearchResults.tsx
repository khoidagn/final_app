import { useState } from 'react';
import { useSearchFeed } from '../Search/hooks/useSearchFeed';
import { useAdminAlbumAction } from './hooks/useAdminAlbumAction';
import { useAdminPhotoAction } from './hooks/useAdminPhotoAction';
import AdminSearchHeader from './components/AdminSearchHeader';
import AdminPhotoGrid from './components/AdminPhotoGrid';
import AdminAlbumGrid from './components/AdminAlbumGrid';
import PhotoModal from '../Photos/PhotoModal';
import AlbumModal from '../Albums/AlbumModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ADMIN_CONSTANTS } from '../../constants/admin.constant';
import { cn } from '../../utils/cn';
import type { PhotoData } from '../../types/photo.type';
import type { AlbumData } from '../../types/album.type';
import type { AdminAlbumData, AdminPhotoData } from '../../types/admin.type';

export default function AdminSearchResults() {
  const {
    query,
    activeTab,
    setActiveTab,
    displayedPhotos,
    displayedAlbums,
    isLoading,
  } = useSearchFeed();

  const [previewPhoto, setPreviewPhoto] = useState<
    PhotoData | AdminPhotoData | null
  >(null);
  const [previewAlbum, setPreviewAlbum] = useState<
    AlbumData | AdminAlbumData | null
  >(null);

  const photoAction = useAdminPhotoAction();
  const albumAction = useAdminAlbumAction();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className={cn(
        'w-full min-h-[500px] flex flex-col p-6',
        'bg-surface border border-border-default rounded-md shadow-xs'
      )}
    >
      <AdminSearchHeader
        query={query}
        activeTab={activeTab}
        photoCount={displayedPhotos.length}
        albumCount={displayedAlbums.length}
        onTabChange={setActiveTab}
      />

      {activeTab === 'photo' && (
        <AdminPhotoGrid
          photos={displayedPhotos}
          isDeleting={photoAction.isDeleting}
          onPreviewPhoto={(photo) => setPreviewPhoto(photo)}
          onDeletePhoto={(id) => photoAction.deletePhoto(id)}
        />
      )}

      {activeTab === 'album' && (
        <AdminAlbumGrid
          albums={displayedAlbums}
          isDeleting={albumAction.isDeleting}
          onPreviewAlbum={(album) => setPreviewAlbum(album)}
          onDeleteAlbum={(id, title) => albumAction.deleteAlbum(id, title)}
        />
      )}

      <PhotoModal
        isOpen={Boolean(previewPhoto)}
        imageUrl={previewPhoto?.media?.imageUrl || ''}
        title={previewPhoto?.title || ''}
        description={previewPhoto?.description || 'No description provided.'}
        onClose={() => setPreviewPhoto(null)}
      />

      <AlbumModal
        isOpen={Boolean(previewAlbum)}
        title={previewAlbum?.title || ''}
        description={previewAlbum?.description || 'No description provided.'}
        imageUrls={
          (previewAlbum?.albumMedias
            ?.map((item) => item.media?.imageUrl)
            .filter(Boolean) as string[]) || []
        }
        onClose={() => setPreviewAlbum(null)}
      />

      <ConfirmModal
        isOpen={photoAction.isConfirmOpen}
        title="Delete Photo (Admin)?"
        description={ADMIN_CONSTANTS.CONFIRM.DELETE_PHOTO}
        confirmText="Delete Photo"
        cancelText="Cancel"
        isDanger={true}
        isLoading={photoAction.isDeleting}
        onClose={() => photoAction.setIsConfirmOpen(false)}
        onConfirm={photoAction.handleConfirmDelete}
      />

      <ConfirmModal
        isOpen={albumAction.isConfirmOpen}
        title="Delete Album (Admin)?"
        description={ADMIN_CONSTANTS.CONFIRM.DELETE_ALBUM(
          albumAction.targetAlbumTitle
        )}
        confirmText="Delete Album"
        cancelText="Cancel"
        isDanger={true}
        isLoading={albumAction.isDeleting}
        onClose={() => albumAction.setIsConfirmOpen(false)}
        onConfirm={albumAction.handleConfirmDelete}
      />
    </div>
  );
}
