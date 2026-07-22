import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    if (isLoading || isAuthLoading) return;
    if (activeTab === 'photo' && !hasMorePhotos) return;
    if (activeTab === 'album' && !hasMoreAlbums) return;

    setIsLoading(true);
    try {
      if (activeTab === 'photo') {
        const nextPage = photoPage + 1;
        const res = await fetchItems('photo', nextPage);

        const cleanData = res?.data?.photos || res?.photos || [];
        const finalArray = Array.isArray(cleanData) ? cleanData : [];

        setDisplayedPhotos((prev) => [...prev, ...finalArray]);
        setHasMorePhotos(finalArray.length >= itemsPerPage);
        setPhotoPage(nextPage);
      } else {
        const nextPage = albumPage + 1;
        const res = await fetchItems('album', nextPage);

        const cleanData = res?.data?.albums || res?.albums || [];
        const finalArray = Array.isArray(cleanData) ? cleanData : [];

        setDisplayedAlbums((prev) => [...prev, ...finalArray]);
        setHasMoreAlbums(finalArray.length >= itemsPerPage);
        setAlbumPage(nextPage);
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
    activeTab,
    photoPage,
    albumPage,
    hasMorePhotos,
    hasMoreAlbums,
    itemsPerPage,
    fetchItems,
  ]);

  useEffect(() => {
    if (mode === 'feed' && !isAuthLoading && !isLoggedIn) {
      navigate('/login');
      return;
    }

    const initData = async () => {
      setIsLoading(true);
      try {
        const [photoRes, albumRes] = await Promise.all([
          fetchItems('photo', 1),
          fetchItems('album', 1),
        ]);

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
        toast.error(
          getBackendMessage(error, FEED_CONSTANTS.API_RESPONSE.FETCH_FAILED)
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthLoading) {
      initData();
    }
  }, [itemsPerPage, mode, isLoggedIn, isAuthLoading, fetchItems, navigate]);

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
