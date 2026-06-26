import React, { useState } from 'react';
import ProfileHeader from '../../pages/Profile/components/ProfileHeader';
import type { ProfileTab, ProfileStats } from '../../types/profile';

interface ProfileLayoutProps {
  firstName: string | undefined;
  lastName: string | undefined;
  avatarUrl: string;
  stats: ProfileStats;
  renderHeaderActions: () => React.ReactNode;
  renderTabContent: (activeTab: ProfileTab) => React.ReactNode;
}

export default function ProfileLayout({
  firstName,
  lastName,
  avatarUrl,
  stats,
  renderHeaderActions,
  renderTabContent,
}: ProfileLayoutProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('photos');

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 w-full flex flex-col">
      <div className="mb-2 pb-4 border-b border-gray-100 w-full">
        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          avatarUrl={avatarUrl}
          stats={stats}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          renderHeaderActions={renderHeaderActions}
        />
      </div>
      <div className="w-full">{renderTabContent(activeTab)}</div>
    </div>
  );
}
