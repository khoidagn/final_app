import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserFollowData, ProfileTab } from '../../../types/profile';
import Avatar from '../../../components/ui/Avatar';
import FollowButton from '../../../components/ui/FollowButton';
import { cn } from '../../../utils/cn';

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

  const fullName =
    user.first_name ||
    `${user.last_name || ''} ${user.first_name || ''}`.trim();

  const isMyProfileFollowing =
    context === 'my-profile' && currentTab === 'followings';

  return (
    <div
      onClick={() => navigate(`/profile/${user.id}`)}
      className={cn(
        'w-full flex flex-col items-center p-4 cursor-pointer select-none transition-all duration-200 transform',
        'bg-background border border-border-default rounded-md shadow-2xs hover:shadow-xs',
        'active:scale-[0.98]' 
      )}
    >
      <div className={cn('mb-2')}>
        <Avatar
          avatarUrl={user.avatar_url}
          firstName={user.first_name || ''}
          lastName={user.last_name || ''}
          sizeClass="w-16 h-16"
          textSizeClass="text-lg"
        />
      </div>

      <h4
        className={cn(
          'text-xs font-bold text-text-primary mb-3 truncate max-w-full'
        )}
      >
        {fullName}
      </h4>

      <div className={cn('flex items-center space-x-4 mb-4 text-center')}>
        <div>
          <span className={cn('text-xl font-bold text-brand block')}>
            {user.photos_count}
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
            {user.albums_count}
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

      <div onClick={(e) => e.stopPropagation()}>
        {isMyProfileFollowing ? (
          <button
            onClick={() => onFollowToggle(user.id, user.is_following)}
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
            isFollowing={user.is_following}
            onToggle={() => onFollowToggle(user.id, user.is_following)}
            textSizeClass="text-[9px] uppercase tracking-wider"
          />
        )}
      </div>
    </div>
  );
}
