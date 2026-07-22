import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface AdminPhotoCardProps {
  id: number;
  title: string;
  imageUrl?: string;
  isDeleting?: boolean;
  onPreview: () => void;
  onDelete: (id: number) => void;
}

export default function AdminPhotoCard({
  id,
  title,
  imageUrl,
  isDeleting = false,
  onPreview,
  onDelete,
}: AdminPhotoCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'w-full aspect-square relative rounded-sm overflow-hidden shrink-0 select-none group',
        'bg-background border border-border-default shadow-2xs'
      )}
    >
      <img
        src={imageUrl || '/default-image.jpg'}
        alt={title}
        onClick={onPreview}
        className={cn(
          'absolute inset-0 w-full h-full object-cover cursor-pointer',
          'hover:opacity-95 transition-opacity'
        )}
      />

      <div
        className={cn(
          'absolute top-0 left-0 right-0 bg-black/50 text-white px-2 py-1.5 flex items-center justify-between z-10',
          'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200'
        )}
      >
        <span
          className={cn(
            'text-[10px] truncate pr-2 font-medium w-full block text-left'
          )}
        >
          {title}
        </span>

        <div className={cn('flex items-center gap-2 shrink-0')}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/photos/${id}/edit`);
            }}
            className={cn(
              'text-white hover:text-brand cursor-pointer focus:outline-none',
              'active:scale-90 transform transition-transform'
            )}
            title="Edit photo"
          >
            <Pencil size={13} strokeWidth={2} />
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className={cn(
              'text-white hover:text-danger shrink-0 cursor-pointer focus:outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'active:scale-90 transform transition-transform'
            )}
            title="Delete photo"
          >
            <Trash2 size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
