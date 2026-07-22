import { useState } from 'react';
import type { AdminAlbumData } from '../../types/admin.type';
import { useAdminPagination } from './hooks/useAdminPagination';
import { useAdminAlbumAction } from './hooks/useAdminAlbumAction';
import AdminAlbumGrid from './components/AdminAlbumGrid';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import AlbumModal from '../Albums/AlbumModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { ADMIN_CONSTANTS } from '../../constants/admin.constant';
import { cn } from '../../utils/cn';

export default function AdminAlbums() {
  const [previewAlbum, setPreviewAlbum] = useState<AdminAlbumData | null>(null);

  const {
    dataList: albums,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    resetCache,
  } = useAdminPagination<AdminAlbumData>({
    endpoint: 'admin/albums',
    uiItemsPerPage: 10,
    bePagesPerBatch: 3,
  });

  const {
    deleteAlbum,
    handleConfirmDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    targetAlbumTitle,
    isDeleting,
  } = useAdminAlbumAction(() => {
    resetCache();
  });

  if (isLoading) {
    return <LoadingSpinner minHeight="min-h-[500px]" />;
  }

  return (
    <div
      className={cn(
        'w-full min-h-[500px] flex flex-col justify-between p-6',
        'bg-surface border border-border-default rounded-md shadow-xs'
      )}
    >
      <AdminAlbumGrid
        albums={albums}
        isDeleting={isDeleting}
        onPreviewAlbum={(album) => setPreviewAlbum(album as AdminAlbumData)}
        onDeleteAlbum={deleteAlbum}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
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
        isOpen={isConfirmOpen}
        title="Delete Album (Admin)?"
        description={ADMIN_CONSTANTS.CONFIRM.DELETE_ALBUM(targetAlbumTitle)}
        confirmText="Delete Album"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
