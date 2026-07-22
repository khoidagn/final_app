import { useNavigate } from 'react-router-dom';
import type { ProfileTab } from '../../../types/profile.type';
import type { UserFollowData } from '../../../types/user.type';
import Avatar from '../../../components/ui/Avatar';
import FollowButton from '../../../components/ui/FollowButton';
import { cn } from '../../../utils/cn';
import { getFullName } from '../../../utils/string';

interface UserCardProps {
  user: UserFollowData;
  context: 'my-profile' | 'public-profile';
  currentTab: ProfileTab;
  onFollowToggle: (userId: number, currentStatus: boolean) => void;
}

export default function UserCard({
  user,
  context,
  currentTab,
  onFollowToggle,
}: UserCardProps) {
  const navigate = useNavigate();

  const savedUserId = localStorage.getItem('userId');
  const myId = savedUserId ? parseInt(savedUserId, 10) : null;

  const isMe = myId !== null && myId === Number(user.id);
  const fullName = getFullName(user.firstName, user.lastName);

  const isMyProfileFollowing =
    context === 'my-profile' && currentTab === 'followings';

  const isFollowingUser =
    context === 'my-profile' && currentTab === 'followings'
      ? true
      : !!user.isFollowing;

  return (
    <div
      onClick={() => {
        if (isMe) {
          navigate('/my-profile');
        } else {
          navigate(`/profile/${user.id}`);
        }
      }}
      className={cn(
        'w-full flex flex-col items-center p-4 cursor-pointer select-none transition-all duration-200 transform',
        'bg-background border border-border-default rounded-md shadow-2xs hover:shadow-xs',
        'active:scale-[0.98]'
      )}
    >
      <div className={cn('mb-2')}>
        <Avatar
          avatarUrl={user.avatarUrl}
          firstName={user.firstName || ''}
          lastName={user.lastName || ''}
          sizeClass="w-16 h-16"
          textSizeClass="text-lg"
        />
      </div>

      <h4
        className={cn(
          'text-xs font-bold text-text-primary mb-3 truncate max-w-full'
        )}
      >
        {fullName}{' '}
        {isMe && (
          <span className="text-[9px] text-text-muted font-normal">(You)</span>
        )}
      </h4>

      <div className={cn('flex items-center space-x-4 mb-4 text-center')}>
        <div>
          <span className={cn('text-xl font-bold text-brand block')}>
            {user.photosCount ?? 0}
          </span>
          <span
            className={cn(
              'text-[9px] font-semibold text-text-muted uppercase tracking-wider'
            )}
          >
            Photos
          </span>
        </div>

        <div className={cn('border-l border-border-default h-6')} />

        <div>
          <span className={cn('text-xl font-bold text-brand block')}>
            {user.albumsCount ?? 0}
          </span>
          <span
            className={cn(
              'text-[9px] font-semibold text-text-muted uppercase tracking-wider'
            )}
          >
            Albums
          </span>
        </div>
      </div>

      {!isMe ? (
        <div onClick={(e) => e.stopPropagation()}>
          {isMyProfileFollowing ? (
            <button
              onClick={() => onFollowToggle(user.id, isFollowingUser)}
              className={cn(
                'w-20 py-0.5 text-[9px] font-bold rounded-xl border uppercase tracking-wider cursor-pointer transition-all transform',
                'border-accent text-accent bg-surface hover:bg-accent/5',
                'active:scale-95'
              )}
            >
              unfollow
            </button>
          ) : (
            <FollowButton
              isFollowing={isFollowingUser}
              onToggle={() => onFollowToggle(user.id, isFollowingUser)}
              textSizeClass="text-[9px] uppercase tracking-wider"
            />
          )}
        </div>
      ) : (
        <div className="h-6 flex items-center">
          <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider bg-border-default/40 px-2 py-0.5 rounded-full">
            You
          </span>
        </div>
      )}
    </div>
  );
}
