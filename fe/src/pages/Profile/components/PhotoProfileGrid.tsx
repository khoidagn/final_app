import type { ProfileCardData } from '../../../types/profile';
import { LockKeyhole } from 'lucide-react';
import EditButton from '../../../components/ui/EditButton';

interface PhotoProfileGridProps {
  items: ProfileCardData[];
  isOwnProfile: boolean;
}

export default function PhotoProfileGrid({
  items,
  isOwnProfile,
}: PhotoProfileGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col group min-w-0">
          <div className="aspect-square bg-gray-100 rounded-md overflow-hidden relative shadow-2xs border border-gray-100">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            {item.is_private && (
              <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full text-[10px]">
                <LockKeyhole size={16} strokeWidth={1} />
              </div>
            )}

            {isOwnProfile && <EditButton to={`/photos/${item.id}/edit`} />}
          </div>
          <span className="text-[11px] text-gray-500 mt-1.5 truncate text-center sm:text-left">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
}
