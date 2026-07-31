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
      className={cn('w-full flex flex-col items-center lg:items-start gap-3')}
    >
      <div
        className={cn(
          'w-full flex flex-wrap items-center justify-center lg:justify-start select-none text-text-muted',
          'gap-3 sm:gap-5 lg:gap-6'
        )}
      >
        {tabs.map((tab, idx) => (
          <React.Fragment key={tab.id}>
            {idx > 0 && (
              <div
                className={cn(
                  'border-l h-4 self-center shrink-0 border-border-default opacity-60'
                )}
              />
            )}

            <button
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                'focus:outline-none transition-all cursor-pointer flex items-center justify-center pb-1 relative transform duration-150 shrink-0',
                'active:scale-95',
                activeTab === tab.id
                  ? 'text-brand font-bold border-b-2 border-brand z-10'
                  : 'hover:text-text-secondary font-medium'
              )}
            >
              <div className={cn('flex items-baseline space-x-1.5')}>
                <span
                  className={cn(
                    'text-base sm:text-lg lg:text-xl font-bold leading-none transition-colors',
                    activeTab === tab.id ? 'text-brand' : 'text-text-primary'
                  )}
                >
                  {tab.count}
                </span>
                <span
                  className={cn(
                    'text-[10px] sm:text-xs font-bold tracking-wider uppercase'
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
        <div
          className={cn(
            'shrink-0 w-full flex justify-center lg:justify-start mt-1'
          )}
        >
          {renderTabAction()}
        </div>
      )}
    </div>
  );
}
