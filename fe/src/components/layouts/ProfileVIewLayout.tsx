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
        'w-full flex flex-col p-6',
        'bg-surface border border-border-default rounded-md shadow-xs'
      )}
    >
      <div className={cn('w-full mb-2 pb-4 border-b border-border-muted')}>
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

      <div className={cn('w-full')}>{renderTabContent(activeTab)}</div>
    </div>
  );
}
