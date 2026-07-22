import { useState } from 'react';
import { toast } from 'sonner';
import { adminService } from '../../../services/admin.service';
import { ADMIN_CONSTANTS } from '../../../constants/admin.constant';
import { getBackendMessage } from '../../../utils/error';

export function useAdminAlbumAction(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetAlbum, setTargetAlbum] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const deleteAlbum = (albumId: number, title: string) => {
    if (isDeleting) return;
    setTargetAlbum({ id: albumId, title });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetAlbum) return;

    setIsDeleting(true);
    try {
      await adminService.deleteAlbum(targetAlbum.id);
      toast.success(ADMIN_CONSTANTS.API_RESPONSE.DELETE_ALBUM_SUCCESS);

      setIsConfirmOpen(false);
      setTargetAlbum(null);

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      toast.error(
        getBackendMessage(
          error,
          ADMIN_CONSTANTS.API_RESPONSE.DELETE_ALBUM_FAILED
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAlbum,
    handleConfirmDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    targetAlbumTitle: targetAlbum?.title || '',
    isDeleting,
  };
}
