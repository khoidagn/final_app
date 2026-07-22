import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { searchApi } from '../../../api/search.api';
import { useDebounce } from '../../../hooks/useDebounce';
import { getBackendMessage } from '../../../utils/error';
import { SEARCH_CONSTANTS } from '../../../constants/search.constant';
import type { SearchResultData } from '../../../types/search.type';
import type { PhotoData } from '../../../types/photo.type';
import type { AlbumData } from '../../../types/album.type';

interface UseSearchBarProps {
  isAdmin?: boolean;
  onSelectPhoto?: (photo: PhotoData) => void;
  onSelectAlbum?: (album: AlbumData) => void;
}

export function useSearchBar({
  isAdmin = false,
  onSelectPhoto,
  onSelectAlbum,
}: UseSearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [query, setQueryValue] = useState<string>(
    () => searchParams.get('q') || ''
  );
  const [results, setResults] = useState<SearchResultData | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const debouncedQuery = useDebounce(query, 350);

  const handleQueryChange = (value: string) => {
    setQueryValue(value);

    if (!value.trim()) {
      setResults(null);
      setIsOpen(false);
    }
  };

  const isSearchPage = isAdmin
    ? location.pathname === '/admin/search'
    : location.pathname === '/search';
  const urlQuery = searchParams.get('q') || '';

  const [prevLocationKey, setPrevLocationKey] = useState(location.key);

  if (prevLocationKey !== location.key) {
    setPrevLocationKey(location.key);
    const nextQuery = isSearchPage ? urlQuery : '';
    setQueryValue(nextQuery);
    setIsOpen(false);
    if (!nextQuery) setResults(null);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    let isMounted = true;
    const triggerSearch = async () => {
      try {
        const response = await searchApi.globalSearch(trimmedQuery);

        if (isMounted && response.data.success) {
          setResults(response.data.data);
          setIsOpen(true);
        }
      } catch (error: unknown) {
        if (isMounted) {
          const msg = getBackendMessage(
            error,
            SEARCH_CONSTANTS.API_RESPONSE.FETCH_SUGGESTIONS_FAILED
          );
          toast.error(msg);
        }
      }
    };

    triggerSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      const trimmed = query.trim();

      setIsOpen(false);
      e.currentTarget.blur();

      const targetPath = isAdmin ? '/admin/search' : '/search';
      navigate(`${targetPath}?q=${encodeURIComponent(trimmed)}`, {
        state: { searchAt: Date.now() },
      });
    }
  };

  const handleItemClick = (
    type: 'photo' | 'album',
    item: PhotoData | AlbumData
  ) => {
    setIsOpen(false);
    handleQueryChange('');

    if (type === 'photo' && onSelectPhoto) {
      onSelectPhoto(item as PhotoData);
    } else if (type === 'album' && onSelectAlbum) {
      onSelectAlbum(item as AlbumData);
    }
  };

  const handleClear = () => {
    handleQueryChange('');
  };

  const hasResults =
    results && (results.photos.length > 0 || results.albums.length > 0);

  return {
    query,
    setQuery: handleQueryChange,
    dropdownRef,
    results,
    isOpen,
    setIsOpen,
    hasResults: Boolean(hasResults),
    handleKeyDown,
    handleItemClick,
    handleClear,
  };
}
