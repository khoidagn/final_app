import type { AlbumData } from '../../../types/album.type';
import FollowButton from '../../../components/ui/FollowButton';
import LikeButton from '../../../components/ui/LikeButton';
import AuthorBadge from './AuthorBadge';
import { getFullName } from '../../../utils/string';
import { cn } from '../../../utils/cn';

interface AlbumCardProps {
  data: AlbumData;
  onFollowToggle?: (
    authorId: number,
    currentStatus: boolean,
    authorName: string
  ) => void;
  onCardClick?: () => void;
  onLikeToggle?: (type: 'photo' | 'album', id: number) => void;
  hideFollowButton?: boolean;
}

export default function AlbumCard({
  data,
  onFollowToggle,
  onCardClick,
  onLikeToggle,
  hideFollowButton = false,
}: AlbumCardProps) {
  if (!data || !data.user) return null;

  const authorInfo = data.user;
  const albumMedias = data.albumMedias || [];
  const authorName = getFullName(authorInfo.firstName, authorInfo.lastName);
  const coverImg = albumMedias[0]?.media?.imageUrl || '/placeholder.jpg';
  const layer2 = albumMedias[1]?.media?.imageUrl || coverImg;
  const layer3 = albumMedias[2]?.media?.imageUrl || coverImg;

  return (
    <div
      onClick={onCardClick}
      className={cn(
        'flex flex-col w-full overflow-hidden transition-all duration-200 md:flex-row',
        'bg-background border border-border-default rounded-md shadow-2xs hover:shadow-sm',
        onCardClick && 'cursor-pointer active:scale-[0.99] transform'
      )}
    >
      <div
        className={cn(
          'w-full aspect-square flex items-center justify-center p-4 relative shrink-0 overflow-hidden select-none md:w-1/2 bg-background/40'
        )}
      >
        <div
          className={cn(
            'absolute w-[80%] h-[80%] rounded-xs overflow-hidden border shadow-xs opacity-60 border-surface bg-surface transform rotate-12'
          )}
        >
          <img
            src={layer3}
            alt="Layer 3"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={cn(
            'absolute w-[80%] h-[80%] rounded-xs overflow-hidden border shadow-xs opacity-80 border-surface bg-surface transform rotate-6'
          )}
        >
          <img
            src={layer2}
            alt="Layer 2"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={cn(
            'absolute w-[83%] h-[83%] rounded-xs overflow-hidden border-2 shadow-md z-10 border-surface bg-surface'
          )}
        >
          <img
            src={coverImg}
            alt="Cover"
            className="w-full h-full object-cover"
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
            <AuthorBadge author={authorInfo} />

            {!hideFollowButton && onFollowToggle && (
              <div onClick={(e) => e.stopPropagation()}>
                <FollowButton
                  isFollowing={authorInfo.isFollowing || false}
                  onToggle={() =>
                    onFollowToggle(
                      authorInfo.id,
                      authorInfo.isFollowing || false,
                      authorName
                    )
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
            {data.description || 'No description provided.'}
          </p>
        </div>

        <div
          className={cn(
            'flex items-center justify-between text-[10px] mt-4 pt-2 border-t md:mt-2 text-text-muted border-border-muted'
          )}
        >
          <time dateTime={data.createdAt}>
            {new Date(data.createdAt).toLocaleDateString()}
          </time>
          <div onClick={(e) => e.stopPropagation()}>
            <LikeButton
              initialLikes={data.likesCount || 0}
              initialIsLiked={data.isLiked || false}
              onToggle={() => onLikeToggle?.('album', data.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
