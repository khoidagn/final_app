import React from 'react';
import ProfileTabs from './ProfileTabs';
import type { ProfileTab, ProfileStats } from '../../../types/profile.type';
import Avatar from '../../../components/ui/Avatar';
import { getFullName } from '../../../utils/string';
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
  const fullName = getFullName(firstName, lastName);

  return (
    <div
      className={cn(
        'w-full flex flex-col items-center gap-4 sm:gap-6',
        'sm:flex-row sm:items-center'
      )}
    >
      <div className={cn('shrink-0')}>
        <Avatar
          avatarUrl={avatarUrl}
          firstName={firstName}
          lastName={lastName}
          sizeClass="w-28 h-28 sm:w-36 sm:h-36"
          textSizeClass="text-2xl"
        />
      </div>

      <div
        className={cn(
          'w-full flex-1 flex flex-col items-center gap-3 sm:gap-4',
          'sm:items-start min-w-0'
        )}
      >
        <div
          className={cn(
            'w-full flex flex-col items-center gap-2.5',
            'sm:flex-row sm:items-center sm:gap-4 min-w-0'
          )}
        >
          <h2
            className={cn(
              'text-lg sm:text-2xl font-bold leading-snug tracking-tight text-text-primary text-center sm:text-left',
              'break-words max-w-full'
            )}
          >
            {fullName}
          </h2>

          <div className={cn('shrink-0')}>{renderHeaderActions()}</div>
        </div>

        <div
          className={cn(
            'w-full flex justify-center sm:justify-start mt-1 sm:mt-0'
          )}
        >
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
