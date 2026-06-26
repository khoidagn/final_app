import React, { type MouseEvent } from 'react';
import type { AlbumData } from '../../../types/feeds';
import FollowButton from '../../../components/ui/FollowButton';
import LikeButton from '../../../components/ui/LikeButton';
import AuthorBadge from './AuthorBadge';

interface AlbumCardProps {
  data: AlbumData;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
  onCardClick?: () => void;
}

export default function AlbumCard({
  data,
  onFollowToggle,
  onCardClick,
}: AlbumCardProps) {
  if (!data || !data.author) return null;

  const images = data?.images || [];
  const [coverImg, secondImg, thirdImg] = images;

  const layer2 = secondImg || coverImg || '/placeholder.jpg';
  const layer3 = thirdImg || coverImg || '/placeholder.jpg';

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={onCardClick}
      className={`flex flex-col md:flex-row bg-gray-50 border border-gray-200 rounded-md overflow-hidden shadow-2xs hover:shadow-sm transition-shadow ${onCardClick ? 'cursor-pointer' : ''}`}
    >
      <div className="w-full md:w-1/2 aspect-square flex items-center justify-center bg-gray-50 p-4 relative shrink-0 overflow-hidden">
        <div className="absolute w-[80%] h-[80%] rounded-xs overflow-hidden shadow-xs border border-white transform rotate-12 opacity-60">
          <img
            src={layer3}
            alt="Layer 3"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute w-[80%] h-[80%] rounded-xs overflow-hidden shadow-xs border border-white transform rotate-6 opacity-80">
          <img
            src={layer2}
            alt="Layer 2"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute w-[83%] h-[83%] rounded-xs overflow-hidden shadow-md border-2 border-white transform z-10">
          <img
            src={coverImg || '/placeholder.jpg'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between mb-2">
            <AuthorBadge author={data.author} />

            {onFollowToggle && (
              <div onClick={stopPropagation}>
                <FollowButton
                  isFollowing={data.author.is_following}
                  onToggle={() =>
                    onFollowToggle(data.author.id, data.author.is_following)
                  }
                />
              </div>
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
          <LikeButton
            initialLikes={data.likes_count}
            initialIsLiked={false}
            photoId={data.id}
          />
          <div>{data.created_at}</div>
        </div>
      </div>
    </div>
  );
}
