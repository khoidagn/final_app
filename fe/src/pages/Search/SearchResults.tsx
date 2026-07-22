import SharedFeedLayout from '../../components/layouts/SharedFeedLayout';
import { useSearchFeed } from './hooks/useSearchFeed';
import { cn } from '../../utils/cn';

export default function SearchResults() {
  const {
    activeTab,
    setActiveTab,
    displayedPhotos,
    displayedAlbums,
    isLoading,
    handleFollowToggle,
    handleLikeToggle,
  } = useSearchFeed();

  return (
    <div className={cn('w-full flex flex-col gap-5 max-w-5xl mx-auto')}>
      <SharedFeedLayout
        photos={displayedPhotos}
        albums={displayedAlbums}
        isLoading={isLoading}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onFollowToggle={handleFollowToggle}
        onLikeToggle={handleLikeToggle}
      />
    </div>
  );
}
