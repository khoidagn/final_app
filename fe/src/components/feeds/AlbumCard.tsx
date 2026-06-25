import type { AlbumData } from '../../types/feeds';
import { getFullName } from '../../utils/string';
import Avatar from '../Avatar'; 
import FollowButton from '../FollowButton';
interface AlbumCardProps {
  data: AlbumData; 
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
}

export default function AlbumCard({ data, onFollowToggle }: AlbumCardProps) {
  if (!data || !data.author) return null;

  const images = data?.images || [];
  const [coverImg, secondImg, thirdImg] = images;

  const layer2 = secondImg || coverImg || "/placeholder.jpg";
  const layer3 = thirdImg || coverImg || "/placeholder.jpg";

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 border border-gray-200 rounded-md overflow-hidden shadow-2xs hover:shadow-sm transition-shadow">
    <div className="w-full md:w-1/2 aspect-square flex items-center justify-center bg-gray-50 p-4 relative shrink-0 overflow-hidden">
      
      <div className="absolute w-[80%] h-[80%] rounded-xs overflow-hidden shadow-xs border border-white transform rotate-12 opacity-60">
        <img src={layer3} alt="Layer 3" className="w-full h-full object-cover" />
      </div>

      <div className="absolute w-[80%] h-[80%] rounded-xs overflow-hidden shadow-xs border border-white transform rotate-6 opacity-80">
        <img src={layer2} alt="Layer 2" className="w-full h-full object-cover" />
      </div>

      <div className="absolute w-[83%] h-[83%] rounded-xs overflow-hidden shadow-md border-2 border-white transform z-10">
        <img src={coverImg || "/placeholder.jpg"} alt="Cover" className="w-full h-full object-cover" />
      </div>

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
                textSizeClass='text-[9px]'
                bgColorClass = "bg-blue-900"
                textColorClass = "text-white" 
              />
              <span className="text-xs font-semibold text-blue-900 truncate">
                {getFullName(data.author.first_name, data.author.last_name)}
              </span>
            </div>

            {onFollowToggle && (
              <FollowButton 
                isFollowing={data.author.is_following} 
                onToggle={() => onFollowToggle(data.author.id, data.author.is_following)} 
              />
            )}
          </div>

          <h3 className="text-xs font-bold text-gray-900 mb-1 truncate">
            {data.title}
          </h3>
          <p className="text-[11px] text-gray-500 leading-tight line-clamp-4 break-words">
            {data.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-4 md:mt-2 pt-2 border-t border-gray-50">
          <div className="flex items-center text-blue-900 font-medium">
            <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {data.likes_count}
          </div>
          <div>{data.created_at}</div>
        </div>
      </div>

    </div>
  );
}