import { Image as ImageIcon, Album } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface AdminSearchHeaderProps {
  query: string;
  activeTab: 'photo' | 'album';
  photoCount: number;
  albumCount: number;
  onTabChange: (tab: 'photo' | 'album') => void;
}

export default function AdminSearchHeader({
  query,
  activeTab,
  photoCount,
  albumCount,
  onTabChange,
}: AdminSearchHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-6 gap-3.5 sm:gap-3',
        'border-b border-border-default'
      )}
    >
      <div className={cn('min-w-0')}>
        <h2
          className={cn(
            'text-sm sm:text-base font-bold text-text-primary truncate'
          )}
        >
          Search Results for:{' '}
          <span className={cn('text-brand break-words')}>"{query}"</span>
        </h2>
        <p className={cn('text-[11px] sm:text-xs text-text-muted mt-0.5')}>
          Found{' '}
          <span className={cn('font-semibold text-text-primary')}>
            {photoCount}
          </span>{' '}
          photos and{' '}
          <span className={cn('font-semibold text-text-primary')}>
            {albumCount}
          </span>{' '}
          albums
        </p>
      </div>

      <div
        className={cn(
          'w-full sm:w-auto flex items-center gap-1 p-1 rounded-sm shrink-0',
          'bg-background border border-border-default'
        )}
      >
        <button
          type="button"
          onClick={() => onTabChange('photo')}
          className={cn(
            'flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-1',
            'text-xs font-semibold rounded-2xs transition-all cursor-pointer select-none',
            activeTab === 'photo'
              ? 'bg-surface text-brand shadow-3xs'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          <ImageIcon size={14} className={cn('shrink-0')} />
          <span>Photos ({photoCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('album')}
          className={cn(
            'flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-1',
            'text-xs font-semibold rounded-2xs transition-all cursor-pointer select-none',
            activeTab === 'album'
              ? 'bg-surface text-brand shadow-3xs'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          <Album size={14} className={cn('shrink-0')} />
          <span>Albums ({albumCount})</span>
        </button>
      </div>
    </div>
  );
}
