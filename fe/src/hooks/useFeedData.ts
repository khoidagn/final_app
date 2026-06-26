import { useState, useEffect, useCallback } from 'react';
import { feedsService } from '../services/feeds.service';
import type { PhotoData, AlbumData, FeedTabType } from '../types/feeds';

interface UseFeedDataProps {
  itemsPerPage: number;
  onFollowAlert?: (authorId: number, nextStatus: boolean) => void;
}

export function useFeedData({ itemsPerPage, onFollowAlert }: UseFeedDataProps) {
  const [activeTab, setActiveTab] = useState<FeedTabType>('photo');
  const [displayedPhotos, setDisplayedPhotos] = useState<PhotoData[]>([]);
  const [displayedAlbums, setDisplayedAlbums] = useState<AlbumData[]>([]);

  const [photoPage, setPhotoPage] = useState<number>(1);
  const [albumPage, setAlbumPage] = useState<number>(1);

  const [hasMorePhotos, setHasMorePhotos] = useState<boolean>(true);
  const [hasMoreAlbums, setHasMoreAlbums] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadMoreItems = useCallback(async () => {
    if (isLoading) return;
    if (activeTab === 'photo' && !hasMorePhotos) return;
    if (activeTab === 'album' && !hasMoreAlbums) return;

    setIsLoading(true);

    try {
      if (activeTab === 'photo') {
        const nextPage = photoPage + 1;
        const res = await feedsService.getPhotos(nextPage, itemsPerPage);
        setDisplayedPhotos((prev) => [...prev, ...res.data]);
        setHasMorePhotos(res.hasMore);
        setPhotoPage(nextPage);
      } else {
        const nextPage = albumPage + 1;
        const res = await feedsService.getAlbums(nextPage, itemsPerPage);
        setDisplayedAlbums((prev) => [...prev, ...res.data]);
        setHasMoreAlbums(res.hasMore);
        setAlbumPage(nextPage);
      }
    } catch (error) {
      console.error('Lỗi khi cuộn tải thêm dữ liệu:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading,
    activeTab,
    photoPage,
    albumPage,
    hasMorePhotos,
    hasMoreAlbums,
    itemsPerPage,
  ]);

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const [photoRes, albumRes] = await Promise.all([
          feedsService.getPhotos(1, itemsPerPage),
          feedsService.getAlbums(1, itemsPerPage),
        ]);
        setDisplayedPhotos(photoRes.data);
        setHasMorePhotos(photoRes.hasMore);
        setDisplayedAlbums(albumRes.data);
        setHasMoreAlbums(albumRes.hasMore);
      } catch (error) {
        console.error('Lỗi khởi tạo danh sách Feed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, [itemsPerPage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
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

    const updateAuthorFollow = <
      T extends { author: { id: number; is_following: boolean } },
    >(
      items: T[]
    ): T[] =>
      items.map((item) =>
        item.author.id === authorId
          ? { ...item, author: { ...item.author, is_following: nextStatus } }
          : item
      );

    setDisplayedPhotos((prev) => updateAuthorFollow(prev));
    setDisplayedAlbums((prev) => updateAuthorFollow(prev));

    if (onFollowAlert) {
      onFollowAlert(authorId, nextStatus);
    }
  };

  return {
    activeTab,
    setActiveTab,
    displayedPhotos,
    displayedAlbums,
    isLoading,
    handleFollowToggle,
  };
}
