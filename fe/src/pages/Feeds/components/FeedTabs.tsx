import { type FeedTabType } from '../../../types/feeds.type';
import { FEED_CONSTANTS } from '../../../constants/feed.constant';
import { cn } from '../../../utils/cn';

interface FeedTabsProps {
  activeTab: FeedTabType;
  onChangeTab: (tab: FeedTabType) => void;
}

export default function FeedTabs({ activeTab, onChangeTab }: FeedTabsProps) {
  return (
    <div
      className={cn(
        'flex border rounded overflow-hidden mb-6 text-xs font-semibold select-none',
        'border-brand'
      )}
    >
      <button
        type="button"
        onClick={() => onChangeTab('photo')}
        className={cn(
          'px-4 py-2 uppercase tracking-wider focus:outline-none cursor-pointer transition-all transform',
          'active:scale-95 duration-75',
          activeTab === 'photo'
            ? 'bg-brand text-white'
            : 'bg-surface text-brand hover:bg-background'
        )}
      >
        {FEED_CONSTANTS.UI.PHOTOS_TAB}
      </button>
      <button
        type="button"
        onClick={() => onChangeTab('album')}
        className={cn(
          'px-4 py-2 uppercase tracking-wider focus:outline-none cursor-pointer transition-all transform',
          'active:scale-95 duration-75',
          activeTab === 'album'
            ? 'bg-brand text-white'
            : 'bg-surface text-brand hover:bg-background'
        )}
      >
        {FEED_CONSTANTS.UI.ALBUMS_TAB}
      </button>
    </div>
  );
}
