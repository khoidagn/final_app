import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { useAdminUserAction } from '../hooks/useAdminUserAction';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { ADMIN_CONSTANTS } from '../../../constants/admin.constant';

interface UserRowActionsProps {
  userId: number;
  email: string;
  onActionSuccess: () => void;
}

export default function UserRowAction({
  userId,
  email,
  onActionSuccess,
}: UserRowActionsProps) {
  const navigate = useNavigate();

  const {
    deleteUser,
    handleConfirmDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    targetUserEmail,
    isDeleting,
  } = useAdminUserAction(onActionSuccess);

  return (
    <>
      <div className={cn('flex items-center justify-center gap-1.5')}>
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => navigate(`/admin/users/${userId}/edit`)}
          className={cn(
            'text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-2xs cursor-pointer focus:outline-none',
            'bg-success hover:bg-success-hover disabled:opacity-50 disabled:cursor-not-allowed',
            'active:scale-[0.97] transform transition-transform'
          )}
        >
          Edit
        </button>

        <button
          type="button"
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            deleteUser(userId, email);
          }}
          className={cn(
            'text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-2xs cursor-pointer focus:outline-none',
            'bg-danger hover:bg-danger-hover disabled:opacity-50 disabled:cursor-not-allowed',
            'active:scale-[0.97] transform transition-transform'
          )}
        >
          Delete
        </button>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete User (Admin)?"
        description={ADMIN_CONSTANTS.CONFIRM.DELETE_USER(
          targetUserEmail || email
        )}
        confirmText="Delete User"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
