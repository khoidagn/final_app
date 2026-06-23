import React, { useState } from 'react';
import { type AlbumData } from '../types/feeds';

interface AlbumModalProps {
  data: AlbumData | null; 
  onClose: () => void;
}

export default function AlbumModal({ data, onClose }: AlbumModalProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  if (!data) return null;

  const { title = "Album Title", description = "", images = [] } = data;

  if (images.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="bg-white p-6 rounded-sm text-xs" onClick={(e) => e.stopPropagation()}>
          Album này hiện chưa có ảnh nào.
          <button onClick={onClose} className="ml-4 text-blue-900 font-bold underline cursor-pointer">Đóng</button>
        </div>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      
      <div 
        className="bg-white rounded-sm w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex flex-col min-w-0 flex-1 pr-4">
            <h2 className="text-sm font-bold text-gray-900 truncate">
              {title}
            </h2>
          </div>
          
          <span className="text-[10px] text-gray-400 font-semibold mr-4 shrink-0">
            {currentIndex + 1} / {images.length}
          </span>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none text-lg font-semibold px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-50 flex items-center justify-center h-[55vh] sm:h-[65vh] overflow-hidden relative group select-none">
          
          {images.length > 1 && (
            <button 
              onClick={handlePrev}
              className="absolute left-4 z-20 w-10 h-10 flex items-center justify-center text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors focus:outline-none cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          <img 
            src={images[currentIndex]} 
            alt={`Detail index ${currentIndex}`} 
            className="max-w-full max-h-full block object-contain" 
          />

          {images.length > 1 && (
            <button 
              onClick={handleNext}
              className="absolute right-4 z-20 w-10 h-10 flex items-center justify-center text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors focus:outline-none cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

        </div>

        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <p className="text-xs text-gray-600 leading-relaxed break-words whitespace-normal">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}