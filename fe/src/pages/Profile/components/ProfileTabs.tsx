import React from 'react';
import type { ProfileTab, ProfileStats } from '../../../types/profile.type';
import { cn } from '../../../utils/cn';

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
    <div
      className={cn(
        'w-full flex flex-col gap-4 pb-0',
        'sm:flex-row sm:items-end sm:justify-between'
      )}
    >
      <div
        className={cn(
          'w-full flex items-center justify-between select-none -mb-px text-text-muted',
          'sm:justify-start sm:w-auto sm:space-x-6'
        )}
      >
        {tabs.map((tab, idx) => (
          <React.Fragment key={tab.id}>
            {idx > 0 && (
              <div
                className={cn(
                  'border-l h-6 self-center mb-2 shrink-0',
                  'sm:h-5 sm:mb-3',
                  'border-border-default'
                )}
              />
            )}
            <button
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                'focus:outline-none transition-all cursor-pointer flex flex-col items-center pb-2 relative flex-1 transform duration-150',
                'sm:flex-initial',
                'active:scale-95',
                activeTab === tab.id
                  ? 'text-brand font-bold border-b-2 border-brand z-10'
                  : 'hover:text-text-secondary font-medium'
              )}
            >
              <div
                className={cn(
                  'flex flex-col items-center text-center',
                  'sm:flex-row sm:items-baseline sm:space-x-1.5 sm:text-left'
                )}
              >
                <span
                  className={cn(
                    'text-lg font-bold leading-none transition-colors',
                    'sm:text-2xl',
                    activeTab === tab.id ? 'text-brand' : 'text-text-primary'
                  )}
                >
                  {tab.count}
                </span>
                <span
                  className={cn(
                    'text-[9px] font-bold tracking-wider uppercase mt-1 shrink-0',
                    'sm:text-[10px] sm:mt-0'
                  )}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          </React.Fragment>
        ))}
      </div>

      {renderTabAction && (
        <div className={cn('shrink-0 w-full flex justify-end sm:w-auto')}>
          {renderTabAction()}
        </div>
      )}
    </div>
  );
}
