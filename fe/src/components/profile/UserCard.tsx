import React from 'react';
import type { UserFollowData } from '../../types/profile';
import Avatar from '../Avatar';
import FollowButton from '../FollowButton';

interface UserCardProps {
  user: UserFollowData;
  onFollowToggle?: (userId: number, currentStatus: boolean) => void;
}

export default function UserCard({ user, onFollowToggle }: UserCardProps) {
  const fullName = `${user.last_name} ${user.first_name}`.trim();

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-md p-4 flex flex-col items-center shadow-2xs hover:shadow-xs transition-all w-full">
      
      <div className="mb-2">
        <Avatar 
          avatarUrl={user.avatar_url} 
          firstName={user.first_name}
          lastName={user.last_name}
          sizeClass="w-16 h-16"         
          textSizeClass="text-lg"        
        />
      </div>

      <h4 className="text-xs font-bold text-gray-800 mb-3 truncate max-w-full">
        {fullName}
      </h4>

      <div className="flex items-center space-x-4 mb-4 text-center">
        <div>
          <span className="text-xl font-bold text-blue-900 block">{user.photos_count}</span>
          <span className="text-[9px] font-semibold text-gray-400 tracking-wider uppercase">Photos</span>
        </div>
        <div className="border-l border-gray-200 h-6"></div>
        <div>
          <span className="text-xl font-bold text-blue-900 block">{user.albums_count}</span>
          <span className="text-[9px] font-semibold text-gray-400 tracking-wider uppercase">Albums</span>
        </div>
      </div>

      <FollowButton 
        isFollowing={user.is_following}
        onToggle={() => onFollowToggle?.(user.id, user.is_following)}
        textSizeClass ="text-[9px] " 
      />

    </div>
  );
}