import React from 'react';
import type { UserFollowData, ProfileTab } from '../../../types/profile';
import UserCard from './UserCard';

interface UserFollowGridProps {
  users: UserFollowData[];
  context: 'my-profile' | 'public-profile';
  currentTab: ProfileTab;
  onAction: (userId: number, currentStatus: boolean) => void;
}

export default function UserFollowGrid({
  users,
  context,
  currentTab,
  onAction,
}: UserFollowGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          context={context}
          currentTab={currentTab}
          onFollowToggle={onAction}
        />
      ))}
    </div>
  );
}
