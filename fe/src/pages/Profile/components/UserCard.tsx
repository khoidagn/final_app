import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserFollowData, ProfileTab } from '../../../types/profile';
import Avatar from '../../../components/ui/Avatar';
import FollowButton from '../../../components/ui/FollowButton';

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
      className="bg-gray-50 border border-gray-100 rounded-md p-4 flex flex-col items-center shadow-2xs hover:shadow-xs transition-all w-full cursor-pointer"
    >
      <div className="mb-2">
        <Avatar
          avatarUrl={user.avatar_url}
          firstName={user.first_name || ''}
          lastName={user.last_name || ''}
          sizeClass="w-16 h-16"
          textSizeClass="text-lg"
        />
      </div>

      <h4 className="text-xs font-bold text-gray-800 mb-3 truncate max-w-full">
        {fullName}
      </h4>

      <div className="flex items-center space-x-4 mb-4 text-center select-none">
        <div>
          <span className="text-xl font-bold text-blue-900 block">
            {user.photos_count}
          </span>
          <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
            Photos
          </span>
        </div>
        <div className="border-l border-gray-200 h-6"></div>
        <div>
          <span className="text-xl font-bold text-blue-900 block">
            {user.albums_count}
          </span>
          <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
            Albums
          </span>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        {isMyProfileFollowing ? (
          <button
            onClick={() => onFollowToggle(user.id, user.is_following)}
            className="w-20 py-0.5 text-[9px] font-bold rounded-xl border border-orange-400 text-orange-500 hover:bg-orange-50 transition-colors uppercase tracking-wider cursor-pointer"
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
