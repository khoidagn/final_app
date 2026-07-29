import { useState } from 'react';
import { toast } from 'sonner';
import { adminService } from '../../../services/admin.service';
import { ADMIN_CONSTANTS } from '../../../constants/admin.constant';
import { getBackendMessage } from '../../../utils/error';

interface ConfirmConfig {
  title: string;
  description: string;
  confirmText: string;
  isDanger: boolean;
  onConfirm: () => Promise<void>;
}

export function useAdminUserAction(onSuccess?: () => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig | null>(
    null
  );

  const toggleUserStatus = (userId: number, currentStatus: boolean) => {
    const actionText = currentStatus ? 'deactivate' : 'activate';
    setConfirmConfig({
      title: `${currentStatus ? 'Deactivate' : 'Activate'} User?`,
      description: ADMIN_CONSTANTS.CONFIRM.TOGGLE_USER_STATUS(actionText),
      confirmText: currentStatus ? 'Deactivate' : 'Activate',
      isDanger: currentStatus,
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await adminService.toggleUserStatus(userId, !currentStatus);
          toast.success(ADMIN_CONSTANTS.API_RESPONSE.TOGGLE_STATUS_SUCCESS);
          setIsConfirmOpen(false);
          if (onSuccess) onSuccess();
        } catch (error: unknown) {
          toast.error(
            getBackendMessage(
              error,
              ADMIN_CONSTANTS.API_RESPONSE.TOGGLE_STATUS_FAILED
            )
          );
        } finally {
          setIsProcessing(false);
        }
      },
    });
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (confirmConfig?.onConfirm) {
      await confirmConfig.onConfirm();
    }
  };

  return {
    toggleUserStatus,
    handleConfirmAction,
    isProcessing,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmConfig,
  };
}
