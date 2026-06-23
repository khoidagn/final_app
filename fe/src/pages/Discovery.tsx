import React, { useState, useEffect, useCallback } from 'react';
import SharedFeedLayout from '../layouts/SharedFeedLayout';
import { MOCK_PHOTOS, MOCK_ALBUMS } from '../mocks/feedsMock';
import type { PhotoData, AlbumData, FeedTabType } from '../types/feeds';

const ITEMS_PER_PAGE = 4; 

export default function Discover() {
  const [activeTab, setActiveTab] = useState<FeedTabType>('photo');

  const [displayedPhotos, setDisplayedPhotos] = useState<PhotoData[]>([]);
  const [displayedAlbums, setDisplayedAlbums] = useState<AlbumData[]>([]);

  const [photoPage, setPhotoPage] = useState<number>(1);
  const [albumPage, setAlbumPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDisplayedPhotos(MOCK_PHOTOS.slice(0, ITEMS_PER_PAGE));
      setDisplayedAlbums(MOCK_ALBUMS.slice(0, ITEMS_PER_PAGE));
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const loadMoreItems = useCallback(() => {
    if (isLoading) return;

    if (activeTab === 'photo' && displayedPhotos.length >= MOCK_PHOTOS.length) return;
    if (activeTab === 'album' && displayedAlbums.length >= MOCK_ALBUMS.length) return;

    setIsLoading(true);

    setTimeout(() => {
      if (activeTab === 'photo') {
        setPhotoPage((prevPage) => {
          const nextPage = prevPage + 1;
          setDisplayedPhotos(MOCK_PHOTOS.slice(0, nextPage * ITEMS_PER_PAGE));
          return nextPage;
        });
      } else {
        setAlbumPage((prevPage) => {
          const nextPage = prevPage + 1;
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
      const targetThreshold = document.documentElement.offsetHeight - 50; // Cách đáy màn hình 50px

      if (scrollPosition >= targetThreshold) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreItems]);

  const handleFollowToggle = (authorId: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus;

    setDisplayedPhotos(prev => prev.map(item => 
      item.author.id === authorId 
        ? { ...item, author: { ...item.author, is_following: nextStatus } }
        : item
    ));

    // Đồng bộ trạng thái luôn sang mảng Album nếu trùng tác giả
    setDisplayedAlbums(prev => prev.map(item => 
      item.author.id === authorId 
        ? { ...item, author: { ...item.author, is_following: nextStatus } }
        : item
    ));

    alert(`[API Discover] Đã thay đổi trạng thái follow của user ${authorId} thành: ${nextStatus}`);
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