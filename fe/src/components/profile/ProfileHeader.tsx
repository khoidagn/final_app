import React from 'react';
import ProfileTabs from './ProfileTabs';
import type { ProfileTab, ProfileStats } from '../../types/profile';
import Avatar from '../Avatar';

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
  renderHeaderActions 
}: ProfileHeaderProps) {
  
  const fullName = `${lastName} ${firstName}`.trim();

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 w-full">
      
      <div className="shrink-0">
        <Avatar 
          avatarUrl={avatarUrl} 
          firstName={firstName}
          lastName={lastName}
          sizeClass="w-36 h-36"          
          textSizeClass="text-2xl"       
        />
      </div>

      <div className="flex-1 flex flex-col items-center sm:items-start gap-4 w-full">
        
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <h2 className="text-2xl font-bold text-gray-900 leading-none tracking-tight">
            {fullName}
          </h2>
          
          <div className="shrink-0">
            {renderHeaderActions()}
          </div>
        </div>

        <div className="w-full flex justify-center sm:justify-start">
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