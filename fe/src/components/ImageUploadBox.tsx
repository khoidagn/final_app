import React from 'react';

interface ImageUploadBoxProps {
  imageSrc?: string;
  onRemove?: () => void;
}

export default function ImageUploadBox({ imageSrc, onRemove }: ImageUploadBoxProps) {
  return (
    <div className="w-32 h-32 relative shrink-0">
      {imageSrc ? (
        <div className="w-full h-full rounded-sm border border-gray-200 overflow-hidden relative shadow-2xs">
          <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
          <button 
            type="button"
            onClick={onRemove}
            className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] focus:outline-none cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
      ) : (
        <label className="w-full h-full rounded-sm border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
          <input type="file" accept="image/*" className="hidden" />
          <span className="text-3xl text-gray-400 group-hover:text-gray-600 transition-colors font-light">+</span>
        </label>
      )}
    </div>
  );
}