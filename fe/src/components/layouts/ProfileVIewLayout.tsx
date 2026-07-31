import React from 'react';
import ProfileHeader from '../../pages/Profile/components/ProfileHeader';
import type { ProfileTab, ProfileStats } from '../../types/profile.type';
import { cn } from '../../utils/cn';

interface ProfileViewLayoutProps {
  firstName: string | undefined;
  lastName: string | undefined;
  avatarUrl: string;
  stats: ProfileStats;
  activeTab: ProfileTab;
  onChangeTab: (tab: ProfileTab) => void;
  renderHeaderActions: () => React.ReactNode;
  renderTabContent: (activeTab: ProfileTab) => React.ReactNode;
}

export default function ProfileViewLayout({
  firstName,
  lastName,
  avatarUrl,
  stats,
  activeTab,
  onChangeTab,
  renderHeaderActions,
  renderTabContent,
}: ProfileViewLayoutProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-col',
        'p-3 sm:p-6 md:p-8',
        'bg-surface',
        'border-0 sm:border border-border-default rounded-none sm:rounded-md shadow-none sm:shadow-xs'
      )}
    >
      <div className={cn('w-full mb-4 pb-4 border-b border-border-default/60')}>
        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          avatarUrl={avatarUrl}
          stats={stats}
          activeTab={activeTab}
          onChangeTab={onChangeTab}
          renderHeaderActions={renderHeaderActions}
        />
      </div>

      <div className={cn('w-full min-w-0')}>{renderTabContent(activeTab)}</div>
    </div>
  );
}
