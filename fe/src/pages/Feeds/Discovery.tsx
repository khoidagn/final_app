import React from 'react';
import SharedFeedLayout from '../../components/layouts/SharedFeedLayout';
import { useFeedData } from '../../hooks/useFeedData';

export default function Discover() {
  const {
    activeTab,
    setActiveTab,
    displayedPhotos,
    displayedAlbums,
    isLoading,
    handleFollowToggle,
  } = useFeedData({
    itemsPerPage: 4,
    onFollowAlert: (authorId, nextStatus) => {
      alert(
        `[API Discover] Đã thay đổi trạng thái follow của user ${authorId} thành: ${nextStatus}`
      );
    },
  });

  return (
    <SharedFeedLayout
      photos={displayedPhotos}
      albums={displayedAlbums}
      isLoading={isLoading}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      onFollowToggle={handleFollowToggle}
    />
  );
}
