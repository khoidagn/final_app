import { X } from 'lucide-react';
import { useSearchBar } from '../hooks/useSearchBar';
import { SearchDropdown } from './SearchDropdown';
import { SEARCH_CONSTANTS } from '../../../constants/search.constant';
import type { PhotoData } from '../../../types/photo.type';
import type { AlbumData } from '../../../types/album.type';
import { cn } from '../../../utils/cn';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  isAdmin?: boolean;
  onSelectPhoto?: (photo: PhotoData) => void;
  onSelectAlbum?: (album: AlbumData) => void;
}

export default function SearchBar({
  placeholder = SEARCH_CONSTANTS.UI.PLACEHOLDER,
  className,
  isAdmin = false,
  onSelectPhoto,
  onSelectAlbum,
}: SearchBarProps) {
  const {
    query,
    setQuery,
    dropdownRef,
    results,
    isOpen,
    setIsOpen,
    hasResults,
    handleKeyDown,
    handleItemClick,
    handleClear,
  } = useSearchBar({ isAdmin, onSelectPhoto, onSelectAlbum });

  return (
    <div ref={dropdownRef} className={cn('relative w-full', className)}>
      <div className={cn('relative flex items-center')}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full bg-surface text-text-primary pl-4 pr-9 py-1.5 rounded-xs text-sm focus:outline-none placeholder-text-muted shadow-inner transition-all',
            'focus:ring-2 focus:ring-accent/50'
          )}
        />

        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'absolute right-2.5 p-0.5 rounded-full text-text-muted transition-colors cursor-pointer',
              'hover:text-text-primary hover:bg-background/80'
            )}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && results && (
        <div
          className={cn(
            'absolute left-0 right-0 mt-1 bg-surface border border-border-default rounded-sm shadow-xl max-h-80 overflow-y-auto z-50 p-2 text-text-primary'
          )}
        >
          <SearchDropdown
            results={results}
            hasResults={hasResults || false}
            onItemClick={handleItemClick}
          />
        </div>
      )}
    </div>
  );
}
