import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface AdminAlbumCardProps {
  id: number;
  title: string;
  coverImageUrl?: string;
  isDeleting?: boolean;
  onPreview: () => void;
  onDelete: (id: number, title: string) => void;
}

export default function AdminAlbumCard({
  id,
  title,
  coverImageUrl,
  isDeleting = false,
  onPreview,
  onDelete,
}: AdminAlbumCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'aspect-square w-full relative flex items-center justify-center select-none group',
        'bg-background/20'
      )}
    >
      <div
        className={cn(
          'absolute w-[82%] h-[82%] rounded-xs bg-border-default border border-surface shadow-2xs opacity-40 transform rotate-12'
        )}
      />
      <div
        className={cn(
          'absolute w-[82%] h-[82%] rounded-xs bg-text-muted border border-surface shadow-2xs opacity-75 transform rotate-6'
        )}
      />

      <div
        className={cn(
          'absolute w-[85%] h-[85%] rounded-xs overflow-hidden shadow-sm border-2 border-surface z-10 transform -rotate-1'
        )}
      >
        <img
          src={coverImageUrl || '/default-album.jpg'}
          alt={title}
          onClick={onPreview}
          className={cn(
            'absolute inset-0 w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity'
          )}
        />

        <div
          className={cn(
            'absolute top-0 left-0 right-0 bg-black/50 text-white px-2 py-1.5 flex items-center justify-between z-20',
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
                navigate(`/admin/albums/${id}/edit`);
              }}
              className={cn(
                'text-white hover:text-brand cursor-pointer focus:outline-none',
                'active:scale-90 transform transition-transform'
              )}
              title="Edit album"
            >
              <Pencil size={13} strokeWidth={2} />
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id, title);
              }}
              className={cn(
                'text-white hover:text-danger shrink-0 cursor-pointer focus:outline-none',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'active:scale-90 transform transition-transform'
              )}
              title="Delete album"
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
