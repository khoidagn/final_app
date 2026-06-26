import React from 'react';
import type { ProfileTab, ProfileStats } from '../../../types/profile';

interface ProfileTabsProps {
  stats: ProfileStats;
  activeTab: ProfileTab;
  onChangeTab: (tab: ProfileTab) => void;
  renderTabAction?: () => React.ReactNode;
}

export default function ProfileTabs({
  stats,
  activeTab,
  onChangeTab,
  renderTabAction,
}: ProfileTabsProps) {
  const tabs: { id: ProfileTab; label: string; count: number }[] = [
    { id: 'photos', label: 'PHOTOS', count: stats.photos },
    { id: 'albums', label: 'ALBUMS', count: stats.albums },
    { id: 'followings', label: 'FOLLOWINGS', count: stats.followings },
    { id: 'followers', label: 'FOLLOWERS', count: stats.followers },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full pb-0">
      <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto sm:space-x-6 text-gray-400 select-none -mb-px">
        {tabs.map((tab, idx) => (
          <React.Fragment key={tab.id}>
            {idx > 0 && (
              <div className="border-l border-gray-200 h-6 sm:h-5 self-center mb-2 sm:mb-3 shrink-0"></div>
            )}
            <button
              onClick={() => onChangeTab(tab.id)}
              className={`focus:outline-none transition-colors cursor-pointer flex flex-col items-center pb-2 relative flex-1 sm:flex-initial ${
                activeTab === tab.id
                  ? 'text-blue-900 font-bold border-b-2 border-blue-900 z-10'
                  : 'hover:text-gray-600 font-medium'
              }`}
            >
              <div className="flex flex-col items-center sm:flex-row sm:items-baseline sm:space-x-1.5 text-center sm:text-left">
                <span
                  className={`text-lg sm:text-2xl font-bold leading-none transition-colors ${
                    activeTab === tab.id ? 'text-blue-900' : 'text-gray-700'
                  }`}
                >
                  {tab.count}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase mt-1 sm:mt-0 shrink-0">
                  {tab.label}
                </span>
              </div>
            </button>
          </React.Fragment>
        ))}
      </div>

      {renderTabAction && (
        <div className="shrink-0 w-full sm:w-auto flex justify-end">
          {renderTabAction()}
        </div>
      )}
    </div>
  );
}
