import { useState } from 'react';
import { toast } from 'sonner';
import { adminService } from '../../../services/admin.service';
import { ADMIN_CONSTANTS } from '../../../constants/admin.constant';
import { getBackendMessage } from '../../../utils/error';

export function useAdminPhotoAction(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetPhotoId, setTargetPhotoId] = useState<number | null>(null);

  const deletePhoto = (photoId: number) => {
    setTargetPhotoId(photoId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetPhotoId) return;

    setIsDeleting(true);
    try {
      await adminService.deletePhoto(targetPhotoId);
      toast.success(ADMIN_CONSTANTS.API_RESPONSE.DELETE_PHOTO_SUCCESS);
      setIsConfirmOpen(false);
      setTargetPhotoId(null);
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      toast.error(
        getBackendMessage(
          error,
          ADMIN_CONSTANTS.API_RESPONSE.DELETE_PHOTO_FAILED
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deletePhoto,
    handleConfirmDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    isDeleting,
  };
}
