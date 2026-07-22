import { useState } from 'react';
import type { AdminPhotoData } from '../../types/admin.type';
import { useAdminPagination } from './hooks/useAdminPagination';
import { useAdminPhotoAction } from './hooks/useAdminPhotoAction';
import AdminPhotoGrid from './components/AdminPhotoGrid';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PhotoModal from '../Photos/PhotoModal';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { ADMIN_CONSTANTS } from '../../constants/admin.constant';
import { cn } from '../../utils/cn';

export default function AdminPhotos() {
  const [previewPhoto, setPreviewPhoto] = useState<AdminPhotoData | null>(null);

  const {
    dataList: photos,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    resetCache,
  } = useAdminPagination<AdminPhotoData>({
    endpoint: 'admin/photos',
    uiItemsPerPage: 40,
    bePagesPerBatch: 2,
  });

  const {
    deletePhoto,
    handleConfirmDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    isDeleting,
  } = useAdminPhotoAction(resetCache);

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
      <AdminPhotoGrid
        photos={photos}
        isDeleting={isDeleting}
        onPreviewPhoto={(p) => setPreviewPhoto(p as AdminPhotoData)}
        onDeletePhoto={deletePhoto}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <PhotoModal
        isOpen={Boolean(previewPhoto)}
        imageUrl={previewPhoto?.media?.imageUrl || ''}
        title={previewPhoto?.title || ''}
        description={previewPhoto?.description || 'No description provided.'}
        onClose={() => setPreviewPhoto(null)}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Photo (Admin)?"
        description={ADMIN_CONSTANTS.CONFIRM.DELETE_PHOTO}
        confirmText="Delete Photo"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
