import React, { type MouseEvent } from 'react';
import type { AlbumData } from '../../../types/feeds';
import FollowButton from '../../../components/ui/FollowButton';
import LikeButton from '../../../components/ui/LikeButton';
import AuthorBadge from './AuthorBadge';
import { cn } from '../../../utils/cn';

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
      className={cn(
        'flex flex-col w-full overflow-hidden transition-all duration-200',
        'md:flex-row',
        'bg-background border border-border-default rounded-md shadow-2xs hover:shadow-sm',
        onCardClick && 'cursor-pointer active:scale-[0.99] transform'
      )}
    >
      <div
        className={cn(
          'w-full aspect-square flex items-center justify-center p-4 relative shrink-0 overflow-hidden select-none',
          'md:w-1/2',
          'bg-background/40'
        )}
      >
        <div
          className={cn(
            'absolute w-[80%] h-[80%] rounded-xs overflow-hidden border shadow-xs opacity-60',
            'border-surface bg-surface transform rotate-12'
          )}
        >
          <img
            src={layer3}
            alt="Layer 3"
            className={cn('w-full h-full object-cover')}
          />
        </div>

        <div
          className={cn(
            'absolute w-[80%] h-[80%] rounded-xs overflow-hidden border shadow-xs opacity-80',
            'border-surface bg-surface transform rotate-6'
          )}
        >
          <img
            src={layer2}
            alt="Layer 2"
            className={cn('w-full h-full object-cover')}
          />
        </div>

        <div
          className={cn(
            'absolute w-[83%] h-[83%] rounded-xs overflow-hidden border-2 shadow-md z-10',
            'border-surface bg-surface transform'
          )}
        >
          <img
            src={coverImg || '/placeholder.jpg'}
            alt="Cover"
            className={cn('w-full h-full object-cover')}
          />
        </div>
      </div>

      <div
        className={cn(
          'w-full p-4 flex flex-col justify-between min-w-0 md:w-1/2'
        )}
      >
        <div>
          <div className={cn('flex items-center justify-between mb-3')}>
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

          <h3
            className={cn('text-xs font-bold text-text-primary mb-1 truncate')}
          >
            {data.title}
          </h3>
          <p
            className={cn(
              'text-[11px] text-text-secondary leading-tight line-clamp-4 break-words'
            )}
          >
            {data.description}
          </p>
        </div>

        <div
          className={cn(
            'flex items-center justify-between text-[10px] mt-4 pt-2 border-t',
            'md:mt-2',
            'text-text-muted border-border-muted'
          )}
        >
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
