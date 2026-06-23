import { type PhotoData } from '../types/feeds';

interface PhotoModalProps {
  data: PhotoData | null; 
  onClose: () => void;
}

export default function PhotoModal({ data, onClose }: PhotoModalProps) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-sm w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-gray-900 truncate pr-4">{data.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg font-semibold px-1 cursor-pointer">✕</button>
        </div>

        <div className="bg-gray-50 flex items-center justify-center h-[55vh] sm:h-[65vh] overflow-hidden">
          <img src={data.image_url} alt={data.title} className="max-w-full max-h-full object-contain" />
        </div>

        <div className="p-4 border-t border-gray-100 bg-white shrink-0 flex flex-col gap-2">
          <p className="text-xs text-gray-600 leading-relaxed">{data.description}</p>
        </div>
      </div>
    </div>
  );
}