import SharedFeedLayout from '../../components/layouts/SharedFeedLayout';
import { useFeedData } from './hooks/useFeedData';

export default function Discover() {
  const {
    activeTab,
    setActiveTab,
    displayedPhotos,
    displayedAlbums,
    isLoading,
    handleFollowToggle,
    handleLikeToggle,
  } = useFeedData({
    mode: 'discovery',
    itemsPerPage: 4,
  });

  return (
    <SharedFeedLayout
      photos={displayedPhotos}
      albums={displayedAlbums}
      isLoading={isLoading}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      onFollowToggle={handleFollowToggle}
      onLikeToggle={handleLikeToggle}
      hideFollowButton={false} 
    />
  );
}
