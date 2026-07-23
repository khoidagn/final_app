import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/auth.context';
import { photoService } from '../../../services/photo.service';
import { albumService } from '../../../services/album.service';
import { useFeedInteractions } from './useFeedInteractions';
import { FEED_CONSTANTS } from '../../../constants/feed.constant';
import { getBackendMessage } from '../../../utils/error';
import type { FeedTabType } from '../../../types/feeds.type';
import type { PhotoData } from '../../../types/photo.type';
import type { AlbumData } from '../../../types/album.type';

interface UseFeedDataProps {
  mode: 'feed' | 'discovery';
  itemsPerPage: number;
  onFollowAlert?: (authorId: number, nextStatus: boolean) => void;
}

export function useFeedData({
  mode,
  itemsPerPage,
  onFollowAlert,
}: UseFeedDataProps) {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<FeedTabType>('photo');
  const [displayedPhotos, setDisplayedPhotos] = useState<PhotoData[]>([]);
  const [displayedAlbums, setDisplayedAlbums] = useState<AlbumData[]>([]);

  const [photoPage, setPhotoPage] = useState<number>(1);
  const [albumPage, setAlbumPage] = useState<number>(1);

  const [hasMorePhotos, setHasMorePhotos] = useState<boolean>(true);
  const [hasMoreAlbums, setHasMoreAlbums] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { handleFollowToggle, handleLikeToggle } = useFeedInteractions({
    setPhotos: setDisplayedPhotos,
    setAlbums: setDisplayedAlbums,
    onFollowAlert,
  });

  const fetchItems = useCallback(
    async (type: 'photo' | 'album', pageNum: number) => {
      if (mode === 'feed' && !isLoggedIn) return null;

      if (type === 'photo') {
        return mode === 'feed'
          ? await photoService.getFeedsPhotos(pageNum, itemsPerPage)
          : await photoService.getDiscoveryPhotos(pageNum, itemsPerPage);
      } else {
        return mode === 'feed'
          ? await albumService.getFeedsAlbums(pageNum, itemsPerPage)
          : await albumService.getDiscoveryAlbums(pageNum, itemsPerPage);
      }
    },
    [mode, itemsPerPage, isLoggedIn]
  );

  const loadMoreItems = useCallback(async () => {
    if (isLoading) return;
    if (mode === 'feed' && isAuthLoading) return;

    if (activeTab === 'photo' && !hasMorePhotos) return;
    if (activeTab === 'album' && !hasMoreAlbums) return;

    setIsLoading(true);
    try {
      if (activeTab === 'photo') {
        const nextPage = photoPage + 1;
        const res = await fetchItems('photo', nextPage);

        const cleanData = res?.data?.photos || res?.photos || [];
        const finalArray = Array.isArray(cleanData) ? cleanData : [];

        if (finalArray.length > 0) {
          setDisplayedPhotos((prev) => [...prev, ...finalArray]);
          setPhotoPage(nextPage);
        }
        setHasMorePhotos(finalArray.length >= itemsPerPage);
      } else {
        const nextPage = albumPage + 1;
        const res = await fetchItems('album', nextPage);

        const cleanData = res?.data?.albums || res?.albums || [];
        const finalArray = Array.isArray(cleanData) ? cleanData : [];

        if (finalArray.length > 0) {
          setDisplayedAlbums((prev) => [...prev, ...finalArray]);
          setAlbumPage(nextPage);
        }
        setHasMoreAlbums(finalArray.length >= itemsPerPage);
      }
    } catch (error: unknown) {
      toast.error(
        getBackendMessage(error, FEED_CONSTANTS.API_RESPONSE.FETCH_FAILED)
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading,
    isAuthLoading,
    mode,
    activeTab,
    photoPage,
    albumPage,
    hasMorePhotos,
    hasMoreAlbums,
    itemsPerPage,
    fetchItems,
  ]);

  useEffect(() => {
    if (mode === 'feed' && (isAuthLoading || !isLoggedIn)) {
      return;
    }

    let isMounted = true;

    const initData = async () => {
      setIsLoading(true);
      try {
        const [photoRes, albumRes] = await Promise.all([
          fetchItems('photo', 1),
          fetchItems('album', 1),
        ]);

        if (!isMounted) return;

        const pData = photoRes?.data?.photos || photoRes?.photos || [];
        const aData = albumRes?.data?.albums || albumRes?.albums || [];

        const safePhotos = Array.isArray(pData) ? pData : [];
        const safeAlbums = Array.isArray(aData) ? aData : [];

        setDisplayedPhotos(safePhotos);
        setHasMorePhotos(safePhotos.length >= itemsPerPage);

        setDisplayedAlbums(safeAlbums);
        setHasMoreAlbums(safeAlbums.length >= itemsPerPage);

        setPhotoPage(1);
        setAlbumPage(1);
      } catch (error: unknown) {
        if (isMounted) {
          toast.error(
            getBackendMessage(error, FEED_CONSTANTS.API_RESPONSE.FETCH_FAILED)
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initData();

    return () => {
      isMounted = false;
    };
  }, [itemsPerPage, mode, isLoggedIn, isAuthLoading, fetchItems]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight;

      if (windowHeight + scrollTop >= documentHeight - 300) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreItems]);

  return {
    activeTab,
    setActiveTab,
    displayedPhotos,
    displayedAlbums,
    isLoading,
    handleFollowToggle,
    handleLikeToggle,
  };
}
