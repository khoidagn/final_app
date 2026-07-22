import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import LogoutButton from '../ui/LogoutButton';
import SearchBar from '../../pages/Search/components/SearchBar';
import PhotoModal from '../../pages/Photos/PhotoModal';
import AlbumModal from '../../pages/Albums/AlbumModal';
import { getFullName } from '../../utils/string';
import { cn } from '../../utils/cn';
import type { PhotoData } from '../../types/photo.type';
import type { AlbumData } from '../../types/album.type';

export default function AdminNavbar() {
  const { user, isLoading } = useAuth();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);

  const albumImageUrls =
    selectedAlbum?.albumMedias
      ?.map((item) => item.media?.imageUrl)
      .filter((url): url is string => Boolean(url)) || [];

  if (isLoading) {
    return (
      <nav className={cn('bg-brand h-14 w-full sticky top-0 z-50 shadow-sm')} />
    );
  }

  return (
    <>
      <nav
        className={cn(
          'bg-brand text-white shadow-sm sticky top-0 z-50 p-3 flex flex-col gap-2 transition-all duration-200 sm:py-2 sm:px-6'
        )}
      >
        <div
          className={cn(
            'w-full flex flex-row gap-2 items-center justify-between sm:grid sm:grid-cols-[120px_1fr_120px] sm:gap-6'
          )}
        >
          <div className={cn('shrink-0 sm:min-w-0')}>
            <Link
              to="/admin"
              className={cn(
                'text-sm font-bold tracking-wide text-white text-decoration-none block truncate active:scale-98 transition-transform'
              )}
            >
              Fotobook Admin
            </Link>
          </div>

          <div
            className={cn(
              'flex flex-row items-center justify-end flex-1 min-w-0 sm:justify-between gap-3'
            )}
          >
            <div className={cn('hidden sm:block w-full max-w-xl mr-4')}>
              <SearchBar
                isAdmin={true} 
                placeholder="Admin Search Photos / Albums..."
                onSelectPhoto={setSelectedPhoto}
                onSelectAlbum={setSelectedAlbum}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className={cn(
                'sm:hidden p-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer',
                isMobileSearchOpen && 'bg-white/20 text-white'
              )}
              title="Toggle search"
              aria-label="Toggle search"
            >
              {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {user ? (
              <Link
                to="/admin/profile"
                className={cn(
                  'flex items-center space-x-2 text-white text-decoration-none shrink-0 group active:scale-98 transition-transform'
                )}
              >
                <Avatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  avatarUrl={user.avatarUrl}
                />
                <span
                  className={cn(
                    'font-medium group-hover:underline md:inline truncate max-w-[100px] sm:max-w-[120px]'
                  )}
                >
                  {getFullName(user.firstName, user.lastName)}
                </span>
              </Link>
            ) : (
              <div className={cn('hidden sm:block w-4')} />
            )}
          </div>

          <div className={cn('shrink-0 text-right sm:text-center sm:min-w-0')}>
            <LogoutButton />
          </div>
        </div>

        {isMobileSearchOpen && (
          <div
            className={cn(
              'w-full block sm:hidden pt-1 pb-1 animate-in fade-in slide-in-from-top-2 duration-150'
            )}
          >
            <SearchBar
              isAdmin={true} 
              placeholder="Admin Search Photos / Albums..."
              onSelectPhoto={setSelectedPhoto}
              onSelectAlbum={setSelectedAlbum}
            />
          </div>
        )}
      </nav>

      <PhotoModal
        isOpen={!!selectedPhoto}
        title={selectedPhoto?.title || ''}
        description={selectedPhoto?.description || ''}
        imageUrl={selectedPhoto?.media?.imageUrl || ''}
        onClose={() => setSelectedPhoto(null)}
      />

      <AlbumModal
        isOpen={!!selectedAlbum}
        title={selectedAlbum?.title || ''}
        description={selectedAlbum?.description || ''}
        imageUrls={albumImageUrls}
        onClose={() => setSelectedAlbum(null)}
      />
    </>
  );
}
