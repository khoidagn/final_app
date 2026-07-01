import React from 'react';
import { type AlbumData } from '../../types/feeds';
import { useAlbumCarousel } from '../../hooks/useAlbumCarousel';
import { CarouselButton } from '../../components/ui/CarouselButton';
import { cn } from '../../utils/cn';

interface AlbumModalProps {
  data: AlbumData;
  onClose: () => void;
}

export default function AlbumModal({ data, onClose }: AlbumModalProps) {
  const { title = 'Album Title', description = '', images = [] } = data;

  const {
    currentIndex,
    isSuperVertical,
    handlePrev,
    handleNext,
    handleImageLoad,
  } = useAlbumCarousel(images);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50'
        )}
        onClick={onClose}
      >
        <div
          className={cn(
            'bg-surface p-6 rounded-md text-xs shadow-2xl text-text-primary'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          Album này hiện chưa có ảnh nào.
          <button
            onClick={onClose}
            className={cn(
              'ml-4 text-brand font-bold underline cursor-pointer',
              'active:scale-95 transform transition-transform inline-block'
            )}
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50'
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-surface rounded-md overflow-hidden shadow-2xl relative inline-flex flex-col w-fit max-w-[90vw] mx-auto',
          'sm:max-w-[65vh]'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            'px-4 pt-3 pb-1 flex items-center justify-between shrink-0 w-0 min-w-full bg-surface select-none'
          )}
        >
          <div className={cn('flex flex-col min-w-0 flex-1 pr-4')}>
            <h2 className={cn('text-sm font-bold text-text-primary truncate')}>
              {title}
            </h2>
          </div>
          <span
            className={cn(
              'text-sm text-text-muted font-semibold mr-4 shrink-0'
            )}
          >
            {currentIndex + 1} / {images.length}
          </span>
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
          {images.length > 1 && (
            <CarouselButton direction="left" onClick={handlePrev} />
          )}

          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Detail index ${currentIndex}`}
            onLoad={handleImageLoad}
            className={cn(
              'w-auto h-full max-h-[calc(60vh-24px)] object-contain block rounded-sm'
            )}
          />

          {images.length > 1 && (
            <CarouselButton direction="right" onClick={handleNext} />
          )}
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
