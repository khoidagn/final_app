import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { searchApi } from '../../../api/search.api';
import { useFeedInteractions } from '../../Feeds/hooks/useFeedInteractions';
import { getBackendMessage } from '../../../utils/error';
import { SEARCH_CONSTANTS } from '../../../constants/search.constant';
import type { FeedTabType } from '../../../types/feeds.type';
import type { PhotoData } from '../../../types/photo.type';
import type { AlbumData } from '../../../types/album.type';
import { SharingMode } from '../../../types/enum.type';

const createFallbackUser = (userId: number) => ({
  id: userId,
  firstName: 'User',
  lastName: '',
  avatarUrl: null,
  isFollowing: false,
});

const normalizePhoto = (photo: Partial<PhotoData> | undefined): PhotoData => ({
  id: photo?.id ?? 0,
  userId: photo?.userId ?? 0,
  mediaId: photo?.mediaId ?? 0,
  title: photo?.title ?? '',
  description: photo?.description ?? '',
  sharingMode: photo?.sharingMode ?? SharingMode.PUBLIC,
  likesCount: photo?.likesCount ?? 0,
  createdAt: photo?.createdAt ?? new Date().toISOString(),
  updatedAt: photo?.updatedAt ?? new Date().toISOString(),
  isLiked: photo?.isLiked ?? false,
  media: photo?.media ?? { id: 0, imageUrl: '' },
  user: photo?.user ?? createFallbackUser(photo?.userId ?? 0),
});

const normalizeAlbum = (album: Partial<AlbumData> | undefined): AlbumData => ({
  id: album?.id ?? 0,
  userId: album?.userId ?? 0,
  title: album?.title ?? '',
  description: album?.description ?? '',
  sharingMode: album?.sharingMode ?? SharingMode.PUBLIC,
  likesCount: album?.likesCount ?? 0,
  createdAt: album?.createdAt ?? new Date().toISOString(),
  updatedAt: album?.updatedAt ?? new Date().toISOString(),
  isLiked: album?.isLiked ?? false,
  albumMedias: album?.albumMedias ?? [],
  user: album?.user ?? createFallbackUser(album?.userId ?? 0),
});

export function useSearchFeed() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get('q') || '';
  const trimmedQuery = query.trim();

  const [activeTab, setActiveTab] = useState<FeedTabType>('photo');
  const [displayedPhotos, setDisplayedPhotos] = useState<PhotoData[]>([]);
  const [displayedAlbums, setDisplayedAlbums] = useState<AlbumData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { handleFollowToggle, handleLikeToggle } = useFeedInteractions({
    setPhotos: setDisplayedPhotos,
    setAlbums: setDisplayedAlbums,
  });

  useEffect(() => {
    if (!trimmedQuery) {
      return;
    }

    let isMounted = true;

    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        const response = await searchApi.globalSearch(trimmedQuery);

        if (isMounted && response.data.success) {
          const rawPhotos: Partial<PhotoData>[] =
            response.data.data.photos || [];
          const rawAlbums: Partial<AlbumData>[] =
            response.data.data.albums || [];

          const safePhotos = rawPhotos.map(normalizePhoto);
          const safeAlbums = rawAlbums.map(normalizeAlbum);

          setDisplayedPhotos(safePhotos);
          setDisplayedAlbums(safeAlbums);
        }
      } catch (error: unknown) {
        if (isMounted) {
          const errorMessage = getBackendMessage(
            error,
            SEARCH_CONSTANTS.API_RESPONSE.EXECUTE_SEARCH_FAILED
          );
          toast.error(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSearchResults();

    return () => {
      isMounted = false;
    };
  }, [trimmedQuery, location.state]);

  const visiblePhotos = trimmedQuery ? displayedPhotos : [];
  const visibleAlbums = trimmedQuery ? displayedAlbums : [];

  return {
    query,
    activeTab,
    setActiveTab,
    displayedPhotos: visiblePhotos,
    displayedAlbums: visibleAlbums,
    isLoading,
    handleFollowToggle,
    handleLikeToggle,
  };
}
