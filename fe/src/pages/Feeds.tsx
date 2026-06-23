import React, { useState, useEffect, useCallback } from 'react';
import SharedFeedLayout from '../layouts/SharedFeedLayout';
import { MOCK_PHOTOS, MOCK_ALBUMS } from '../mocks/feedsMock';
import type { PhotoData, AlbumData, FeedTabType } from '../types/feeds';

const ITEMS_PER_PAGE = 4;

export default function Feeds() {
  const [activeTab, setActiveTab] = useState<FeedTabType>('photo');
  
  const [displayedPhotos, setDisplayedPhotos] = useState<PhotoData[]>([]);
  const [displayedAlbums, setDisplayedAlbums] = useState<AlbumData[]>([]);
  
  const [photoPage, setPhotoPage] = useState<number>(1);
  const [albumPage, setAlbumPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setDisplayedPhotos(MOCK_PHOTOS.slice(0, ITEMS_PER_PAGE));
    setDisplayedAlbums(MOCK_ALBUMS.slice(0, ITEMS_PER_PAGE));
  }, []);

  const loadMoreItems = useCallback(() => {
    if (isLoading) return;

    if (activeTab === 'photo' && displayedPhotos.length >= MOCK_PHOTOS.length) return;
    if (activeTab === 'album' && displayedAlbums.length >= MOCK_ALBUMS.length) return;

    setIsLoading(true);

    setTimeout(() => {
      if (activeTab === 'photo') {
        setPhotoPage((prev) => {
          const nextPage = prev + 1;
          setDisplayedPhotos(MOCK_PHOTOS.slice(0, nextPage * ITEMS_PER_PAGE));
          return nextPage;
        });
      } else {
        setAlbumPage((prev) => {
          const nextPage = prev + 1;
          setDisplayedAlbums(MOCK_ALBUMS.slice(0, nextPage * ITEMS_PER_PAGE));
          return nextPage;
        });
      }
      setIsLoading(false);
    }, 800);
  }, [isLoading, activeTab, displayedPhotos.length, displayedAlbums.length]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const targetThreshold = document.documentElement.offsetHeight - 50;

      if (scrollPosition >= targetThreshold) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreItems]);

  const handleFollowToggle = (authorId: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setDisplayedPhotos(prev => prev.map(p => p.author.id === authorId ? { ...p, author: { ...p.author, is_following: nextStatus } } : p));
    setDisplayedAlbums(prev => prev.map(a => a.author.id === authorId ? { ...a, author: { ...a.author, is_following: nextStatus } } : a));
  };

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