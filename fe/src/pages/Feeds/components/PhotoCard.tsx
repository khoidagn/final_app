import React from 'react';
import type { PhotoData } from '../../../types/feeds';
import FollowButton from '../../../components/ui/FollowButton';
import LikeButton from '../../../components/ui/LikeButton';
import AuthorBadge from './AuthorBadge';

interface PhotoCardProps {
  data: PhotoData;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
  onCardClick?: () => void;
}

export default function PhotoCard({
  data,
  onFollowToggle,
  onCardClick,
}: PhotoCardProps) {
  if (!data || !data.author) return null;

  return (
    <div
      onClick={onCardClick}
      className="flex flex-col md:flex-row bg-gray-50 border border-gray-200 rounded-md overflow-hidden shadow-2xs hover:shadow-sm transition-shadow cursor-pointer"
    >
      <div className="w-full md:w-1/2 aspect-square flex items-center justify-center bg-gray-50 relative shrink-0 overflow-hidden">
        <img
          src={data.image_url}
          alt={data.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between mb-2">
            <AuthorBadge author={data.author} />

            {onFollowToggle && (
              <div onClick={(e) => e.stopPropagation()}>
                <FollowButton
                  isFollowing={data.author.is_following}
                  onToggle={() =>
                    onFollowToggle(data.author.id, data.author.is_following)
                  }
                />
              </div>
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
          <LikeButton
            initialLikes={data.likes_count}
            initialIsLiked={false}
            photoId={data.id}
          />
          <span>{data.created_at}</span>
        </div>
      </div>
    </div>
  );
}
