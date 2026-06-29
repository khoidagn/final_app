import type { PhotoData } from '../../../types/feeds';
import FollowButton from '../../../components/ui/FollowButton';
import LikeButton from '../../../components/ui/LikeButton';
import AuthorBadge from './AuthorBadge';
import { cn } from '../../../utils/cn';

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
      className={cn(
        'flex flex-col w-full overflow-hidden transition-all duration-200',
        'md:flex-row',
        'bg-background border border-border-default rounded-md shadow-2xs hover:shadow-sm',
        onCardClick && 'cursor-pointer active:scale-[0.99] transform'
      )}
    >
      <div
        className={cn(
          'w-full aspect-square flex items-center justify-center relative shrink-0 overflow-hidden select-none',
          'md:w-1/2',
          'bg-background/40'
        )}
      >
        <img
          src={data.image_url}
          alt={data.title}
          className={cn('w-full h-full object-cover')}
        />
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

          <h3
            className={cn(
              'text-xs font-bold text-text-primary mb-1 leading-tight truncate'
            )}
          >
            {data.title}
          </h3>
          <p
            className={cn(
              'text-[11px] text-text-secondary leading-relaxed line-clamp-4 break-words'
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
          <span>{data.created_at}</span>
        </div>
      </div>
    </div>
  );
}
