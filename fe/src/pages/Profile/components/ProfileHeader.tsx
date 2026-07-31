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
        'w-full flex flex-col items-center gap-4',
        'lg:flex-row lg:items-center lg:gap-8'
      )}
    >
      <div className={cn('shrink-0 flex justify-center')}>
        <Avatar
          avatarUrl={avatarUrl}
          firstName={firstName}
          lastName={lastName}
          sizeClass="w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36"
          textSizeClass="text-xl lg:text-2xl"
        />
      </div>

      <div
        className={cn(
          'w-full flex-1 flex flex-col items-center gap-3',
          'lg:items-start min-w-0'
        )}
      >
        <div
          className={cn(
            'w-full flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 min-w-0'
          )}
        >
          <h2
            className={cn(
              'text-xl sm:text-2xl font-bold leading-snug tracking-tight text-text-primary text-center lg:text-left',
              'truncate max-w-full'
            )}
          >
            {fullName}
          </h2>

          <div className={cn('shrink-0 flex items-center')}>
            {renderHeaderActions()}
          </div>
        </div>

        <div className={cn('w-full flex justify-center lg:justify-start mt-1')}>
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
