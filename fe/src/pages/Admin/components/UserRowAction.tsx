import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';

interface UserRowActionsProps {
  userId: number;
  email?: string;
  onActionSuccess?: () => void;
}

export default function UserRowAction({ userId }: UserRowActionsProps) {
  const navigate = useNavigate();

  return (
    <div className={cn('flex items-center justify-center')}>
      <button
        type="button"
        onClick={() => navigate(`/admin/users/${userId}/edit`)}
        className={cn(
          'text-white text-[10px] font-bold px-2.5 py-1 rounded-sm shadow-2xs cursor-pointer focus:outline-none',
          'bg-success hover:bg-success-hover',
          'active:scale-[0.97] transform transition-transform'
        )}
      >
        Edit
      </button>
    </div>
  );
}
