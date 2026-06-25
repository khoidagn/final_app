import { Link } from 'react-router-dom';
import type { PhotoData } from '../../types/feeds';
import { getFullName } from '../../utils/string';
import Avatar from '../Avatar'; 
import FollowButton from '../FollowButton';
interface PhotoCardProps {
  data: PhotoData;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
}

export default function PhotoCard({ data, onFollowToggle }: PhotoCardProps) {
  if (!data || !data.author) return null;
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 border border-gray-200 rounded-md overflow-hidden shadow-2xs hover:shadow-sm transition-shadow">
      <div className="w-full md:w-1/2 aspect-square flex items-center justify-center bg-gray-50 relative shrink-0 overflow-hidden">
        <img src={data.image_url} alt={data.title} className="w-full h-full object-cover" />
      </div>
      <div className="w-full md:w-1/2 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 min-w-0">
              <Avatar 
                firstName={data.author.first_name}
                lastName={data.author.last_name}
                avatarUrl={data.author.avatar_url}
                sizeClass="w-5 h-5"
                textSizeClass="text-[9px]"
                bgColorClass = "bg-blue-900"
                textColorClass = "text-white" 
              />
              <Link to="#" className="text-xs font-semibold text-blue-900 hover:underline text-decoration-none truncate">
                {getFullName(data.author.first_name, data.author.last_name)}
              </Link>
            </div>

            {onFollowToggle && (
              <FollowButton 
                isFollowing={data.author.is_following} 
                onToggle={() => onFollowToggle(data.author.id, data.author.is_following)} 
              />
            )}
          </div>
          
          <h3 className="text-xs font-bold text-gray-900 mb-1 leading-tight truncate">
            {data.title}
          </h3>
          <p className="text-[11px] text-gray-500 line-clamp-4 leading-relaxed break-words">
            {data.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-4 md:mt-2">
          <span className="flex items-center cursor-pointer hover:text-red-500 transition-colors">
            <svg className="w-3 h-3 mr-1 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {data.likes_count}
          </span>
          <span>{data.created_at}</span>
        </div>
      </div>

    </div>
  );
}