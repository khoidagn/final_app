import React from 'react';
import { type AlbumData } from '../../types/feeds';
import { useAlbumCarousel } from '../../hooks/useAlbumCarousel';
import { CarouselButton } from '../../components/ui/CarouselButton';

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
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-md text-xs shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          Album này hiện chưa có ảnh nào.
          <button
            onClick={onClose}
            className="ml-4 text-blue-900 font-bold underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md overflow-hidden shadow-2xl relative inline-flex flex-col w-fit max-w-[90vw] sm:max-w-[65vh] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 pt-3 pb-1 flex items-center justify-between shrink-0 w-0 min-w-full bg-white select-none">
          <div className="flex flex-col min-w-0 flex-1 pr-4">
            <h2 className="text-sm font-bold text-gray-900 truncate">
              {title}
            </h2>
          </div>
          <span className="text-sm text-gray-400 font-semibold mr-4 shrink-0">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg font-semibold px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div
          className={`p-3 pt-1 flex items-center justify-center max-h-[60vh] w-fit mx-auto overflow-hidden bg-white relative group select-none transition-all ${
            isSuperVertical ? 'min-w-[45vh]' : 'min-w-0'
          }`}
        >
          {images.length > 1 && (
            <CarouselButton direction="left" onClick={handlePrev} />
          )}

          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Detail index ${currentIndex}`}
            onLoad={handleImageLoad}
            className="w-auto h-full max-h-[calc(60vh-24px)] object-contain block rounded-sm"
          />

          {images.length > 1 && (
            <CarouselButton direction="right" onClick={handleNext} />
          )}
        </div>

        <div className="px-4 pb-4 border-t border-gray-100 bg-white shrink-0 w-0 min-w-full">
          <p className="text-xs text-gray-600 leading-relaxed break-words whitespace-normal pt-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
