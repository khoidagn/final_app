import React, { useState } from 'react';
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
  const [isSuperVertical, setIsSuperVertical] = useState(false);

  if (!isOpen) return null;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setIsSuperVertical(naturalHeight / naturalWidth > 1.2);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-100'
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-surface rounded-md overflow-hidden shadow-2xl relative inline-flex flex-col w-fit max-w-[90vw] mx-auto',
          'sm:max-w-[70vh]'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            'px-4 pt-3 pb-1 flex items-center justify-between shrink-0 w-0 min-w-full bg-surface select-none'
          )}
        >
          <h2 className={cn('text-sm font-bold text-text-primary truncate')}>
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
            'p-3 pt-1 flex items-center justify-center max-h-[60vh] w-fit mx-auto overflow-hidden bg-surface relative group select-none transition-all',
            isSuperVertical ? 'min-w-[45vh]' : 'min-w-0'
          )}
        >
          <img
            src={imageUrl}
            alt={title}
            onLoad={handleImageLoad}
            className={cn(
              'w-auto h-full max-h-[calc(60vh-24px)] object-contain block rounded-sm'
            )}
          />
        </div>

        <div
          className={cn(
            'px-4 pb-4 border-t border-border-muted bg-surface shrink-0 w-0 min-w-full'
          )}
        >
          <p
            className={cn(
              'text-xs text-text-secondary leading-relaxed break-words whitespace-normal pt-2'
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
