import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '../../../utils/cn';
import { userApi } from '../../../api/user.api';
import { PROFILE_CONSTANTS } from '../../../constants/profile.constant';
import { getBackendMessage } from '../../../utils/error';
import ConfirmModal from '../../../components/ui/ConfirmModal';

interface DangerZoneProps {
  onDeleteSuccess?: () => void;
}

export default function DangerZone({ onDeleteSuccess }: DangerZoneProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await userApi.deleteAccount();
      toast.success(PROFILE_CONSTANTS.API_RESPONSE.DELETE_SUCCESS);
      localStorage.clear();

      setIsModalOpen(false);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        window.location.href = '/login';
      }
    } catch (error: unknown) {
      toast.error(
        getBackendMessage(error, PROFILE_CONSTANTS.API_RESPONSE.DELETE_FAILED)
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto mt-10 flex flex-col items-center">
        <div className="w-full border-t border-border-muted mb-6" />

        <p className="text-[10px] text-text-muted text-center max-w-sm mb-3 leading-relaxed">
          {PROFILE_CONSTANTS.UI.DANGER_ZONE_TEXT}
        </p>

        <button
          type="button"
          disabled={isDeleting}
          onClick={handleOpenDeleteModal}
          className={cn(
            'text-[11px] font-bold text-danger hover:text-danger/80 transition-all cursor-pointer underline decoration-dotted underline-offset-4',
            'disabled:opacity-50'
          )}
        >
          {isDeleting
            ? PROFILE_CONSTANTS.UI.DELETING_BUTTON
            : PROFILE_CONSTANTS.UI.DELETE_BUTTON}
        </button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Account?"
        description={PROFILE_CONSTANTS.CONFIRM.DELETE_ACCOUNT_WARNING}
        confirmText="Delete Account"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
