import { useState } from 'react';
import { type PhotoData } from '../../types/feeds';

interface PhotoModalProps {
  data: PhotoData | null;
  onClose: () => void;
}

export default function PhotoModal({ data, onClose }: PhotoModalProps) {
  const [isSuperVertical, setIsSuperVertical] = useState(false);

  if (!data) return null;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;

    if (naturalHeight / naturalWidth > 1.2) {
      setIsSuperVertical(true);
    } else {
      setIsSuperVertical(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md overflow-hidden shadow-2xl relative inline-flex flex-col w-fit max-w-[90vw] sm:max-w-[70vh] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 pt-3 flex items-center justify-between shrink-0 w-0 min-w-full bg-white">
          <h2 className="text-sm font-bold text-gray-900 truncate">
            {data.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-semibold px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div
          className={`p-3 pt-1 flex items-center justify-center max-h-[60vh] w-fit mx-auto overflow-hidden bg-white transition-all ${
            isSuperVertical ? 'min-w-[45vh]' : 'min-w-0'
          }`}
        >
          <img
            src={data.image_url}
            alt={data.title}
            onLoad={handleImageLoad}
            className="w-auto h-full max-h-[calc(60vh-24px)] object-contain block select-none"
          />
        </div>

        <div className="px-4 pb-4 border-t border-gray-100 bg-white shrink-0 w-0 min-w-full">
          <p className="text-xs text-gray-600 leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
}
