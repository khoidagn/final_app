import { type FeedTabType } from '../../../types/feeds';

interface FeedTabsProps {
  activeTab: FeedTabType;
  onChangeTab: (tab: FeedTabType) => void;
}

export default function FeedTabs({ activeTab, onChangeTab }: FeedTabsProps) {
  return (
    <div className="flex border border-blue-900 rounded overflow-hidden mb-6 text-xs font-semibold">
      <button
        onClick={() => onChangeTab('photo')}
        className={`px-4 py-2 uppercase tracking-wider focus:outline-none cursor-pointer transition-colors ${
          activeTab === 'photo'
            ? 'bg-blue-900 text-white'
            : 'bg-white text-blue-900 hover:bg-gray-50'
        }`}
      >
        Photo
      </button>
      <button
        onClick={() => onChangeTab('album')}
        className={`px-4 py-2 uppercase tracking-wider focus:outline-none cursor-pointer transition-colors ${
          activeTab === 'album'
            ? 'bg-blue-900 text-white'
            : 'bg-white text-blue-900 hover:bg-gray-50'
        }`}
      >
        Album
      </button>
    </div>
  );
}
