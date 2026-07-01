import React from 'react';
import ProfileTabs from './ProfileTabs';
import type { ProfileTab, ProfileStats } from '../../../types/profile';
import Avatar from '../../../components/ui/Avatar';
import { cn } from '../../../utils/cn';

interface ProfileHeaderProps {
  firstName: string | undefined;
  lastName: string | undefined;
  avatarUrl: string;
  stats: ProfileStats;
  activeTab: ProfileTab;
  onChangeTab: (tab: ProfileTab) => void;
  renderHeaderActions: () => React.ReactNode;
}

export default function ProfileHeader({
  firstName,
  lastName,
  avatarUrl,
  stats,
  activeTab,
  onChangeTab,
  renderHeaderActions,
}: ProfileHeaderProps) {
  const fullName = `${lastName || ''} ${firstName || ''}`.trim();

  return (
    <div
      className={cn(
        'w-full flex flex-col items-center gap-6',
        'sm:flex-row sm:items-center'
      )}
    >
      <div className={cn('shrink-0')}>
        <Avatar
          avatarUrl={avatarUrl}
          firstName={firstName}
          lastName={lastName}
          sizeClass="w-36 h-36"
          textSizeClass="text-2xl"
        />
      </div>

      <div
        className={cn(
          'w-full flex-1 flex flex-col items-center gap-4',
          'sm:items-start'
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center gap-3',
            'sm:flex-row sm:gap-4'
          )}
        >
          <h2
            className={cn(
              'text-2xl font-bold leading-none tracking-tight text-text-primary'
            )}
          >
            {fullName}
          </h2>

          <div className={cn('shrink-0')}>{renderHeaderActions()}</div>
        </div>

        <div className={cn('w-full flex justify-center sm:justify-start')}>
          <ProfileTabs
            stats={stats}
            activeTab={activeTab}
            onChangeTab={onChangeTab}
          />
        </div>
      </div>
    </div>
  );
}
