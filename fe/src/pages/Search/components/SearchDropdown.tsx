import { Image as ImageIcon, Folder } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { SEARCH_CONSTANTS } from '../../../constants/search.constant';
import type { SearchResultData } from '../../../types/search.type';
import type { PhotoData } from '../../../types/photo.type';
import type { AlbumData } from '../../../types/album.type';

interface SearchDropdownProps {
  results: SearchResultData;
  hasResults: boolean;
  onItemClick: (type: 'photo' | 'album', item: PhotoData | AlbumData) => void;
}

export function SearchDropdown({
  results,
  hasResults,
  onItemClick,
}: SearchDropdownProps) {
  if (!hasResults) {
    return (
      <div className={cn('p-3 text-xs text-text-muted text-center')}>
        {SEARCH_CONSTANTS.UI.PRESS_ENTER_PROMPT}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3')}>
      {results.photos.length > 0 && (
        <div>
          <div
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider text-text-muted px-2 mb-1'
            )}
          >
            {SEARCH_CONSTANTS.UI.PHOTOS_SECTION}
          </div>
          {results.photos.slice(0, 5).map((photo) => (
            <div
              key={photo.id}
              onClick={() => onItemClick('photo', photo)}
              className={cn(
                'flex items-center gap-2 p-1.5 rounded-xs cursor-pointer text-xs justify-between transition-colors',
                'hover:bg-background/80'
              )}
            >
              <div className={cn('flex items-center gap-2 truncate flex-1')}>
                {photo.media?.imageUrl ? (
                  <img
                    src={photo.media.imageUrl}
                    alt={photo.title}
                    className={cn('w-6 h-6 object-cover rounded-xs shrink-0')}
                  />
                ) : (
                  <ImageIcon
                    size={16}
                    className={cn('text-text-muted shrink-0')}
                  />
                )}
                <span className={cn('truncate font-medium')}>
                  {photo.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.albums.length > 0 && (
        <div>
          <div
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider text-text-muted px-2 mb-1'
            )}
          >
            {SEARCH_CONSTANTS.UI.ALBUMS_SECTION}
          </div>
          {results.albums.slice(0, 5).map((album) => {
            const cover = album.albumMedias?.[0]?.media?.imageUrl;
            return (
              <div
                key={album.id}
                onClick={() => onItemClick('album', album)}
                className={cn(
                  'flex items-center gap-2 p-1.5 rounded-xs cursor-pointer text-xs justify-between transition-colors',
                  'hover:bg-background/80'
                )}
              >
                <div className={cn('flex items-center gap-2 truncate flex-1')}>
                  {cover ? (
                    <img
                      src={cover}
                      alt={album.title}
                      className={cn('w-6 h-6 object-cover rounded-xs shrink-0')}
                    />
                  ) : (
                    <Folder
                      size={16}
                      className={cn('text-text-muted shrink-0')}
                    />
                  )}
                  <span className={cn('truncate font-medium')}>
                    {album.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
