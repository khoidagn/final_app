import type { ProfileTab } from '../../../types/profile.type';
import type { UserFollowData } from '../../../types/user.type';
import UserCard from './UserCard';
import { cn } from '../../../utils/cn';

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
    <div
      className={cn(
        'w-full grid grid-cols-2 gap-4',
        'sm:grid-cols-3',
        'md:grid-cols-4'
      )}
    >
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
