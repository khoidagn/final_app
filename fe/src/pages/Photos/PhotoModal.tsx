import { cn } from '../../utils/cn';

interface PhotoModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  description?: string;
  onClose: () => void;
}

export default function PhotoModal({
  isOpen,
  imageUrl,
  title,
  description = '',
  onClose,
}: PhotoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/80 flex items-center justify-center p-4 sm:p-6 z-100'
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-surface rounded-md overflow-hidden shadow-2xl relative flex flex-col',
          'w-full max-w-lg md:max-w-xl mx-auto'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={cn(
            'px-4 pt-3 flex items-center justify-between shrink-0 bg-surface select-none border-b border-border-muted'
          )}
        >
          <h2
            className={cn('text-sm font-bold text-text-primary truncate pr-4')}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              'text-text-muted hover:text-text-primary transition-colors text-lg font-semibold px-1 cursor-pointer',
              'active:scale-90 transform'
            )}
          >
            ✕
          </button>
        </div>

        <div
          className={cn(
            'w-full h-[55vh] max-h-[500px] min-h-[280px] bg-surface flex items-center justify-center relative group select-none overflow-hidden'
          )}
        >
          <img
            src={imageUrl}
            alt={title}
            className={cn('w-full h-full object-contain px-2 block')}
          />
        </div>

        <div
          className={cn(
            'px-4 pb-3 border-t border-border-muted bg-surface shrink-0 max-h-[120px] overflow-y-auto'
          )}
        >
          <p
            className={cn(
              'text-xs text-text-secondary leading-relaxed break-words whitespace-normal'
            )}
          >
            {description || 'No description provided.'}
          </p>
        </div>
      </div>
    </div>
  );
}
