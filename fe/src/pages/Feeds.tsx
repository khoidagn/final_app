import React from 'react';
import SharedFeedLayout from '../layouts/SharedFeedLayout';
import { useFeedData } from '../hooks/useFeedData';

export default function Feeds() {
  const {
    activeTab,
    setActiveTab,
    displayedPhotos,
    displayedAlbums,
    isLoading
  } = useFeedData({ itemsPerPage: 4 });

  return (
    <SharedFeedLayout 
      photos={displayedPhotos} 
      albums={displayedAlbums} 
      isLoading={isLoading}
      activeTab={activeTab} 
      onChangeTab={setActiveTab} 
    />
  );
}