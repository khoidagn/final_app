import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../utils/cn';
import ProfileViewLayout from '../../components/layouts/ProfileVIewLayout';
import PhotoProfileGrid from './components/PhotoProfileGrid';
import AlbumProfileGrid from './components/AlbumProfileGrid';
import UserFollowGrid from './components/UserFollowGrid';
import PhotoModal from '../Photos/PhotoModal';
import AlbumModal from '../Albums/AlbumModal';
import { useProfileData } from './hooks/useProfileData';
import { useModalState } from '../../hooks/useModalState';
import type { ProfileTab } from '../../types/profile.type';
import type { PhotoData } from '../../types/photo.type';
import type { AlbumData } from '../../types/album.type';

export default function MyProfile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabQuery = (searchParams.get('tab') as ProfileTab) || 'photos';
  const photoModal = useModalState<PhotoData>();
  const albumModal = useModalState<AlbumData>();

  const {
    profileUser,
    stats,
    photos,
    albums,
    followings,
    followers,
    handleFollowToggle,
    isLoading,
  } = useProfileData({ isOwnProfile: true });

  if (isLoading || !profileUser) {
    return (
      <div
        className={cn('p-8 text-center text-xs font-semibold text-text-muted')}
      >
        Loading profile...
      </div>
    );
  }

  const handleTabChange = (newTab: ProfileTab) => {
    setSearchParams({ tab: newTab });
  };

  const profileAlbumImageUrls =
    (albumModal.selectedItem?.albumMedias
      ?.map((item) => item.media?.imageUrl)
      .filter(Boolean) as string[]) || [];

  return (
    <>
      <ProfileViewLayout
        firstName={profileUser.firstName}
        lastName={profileUser.lastName}
        avatarUrl={profileUser.avatarUrl}
        stats={stats}
        activeTab={tabQuery}
        onChangeTab={handleTabChange}
        renderHeaderActions={() => (
          <button
            type="button"
            onClick={() => navigate('/my-profile/edit')}
            className={cn(
              'text-xs font-semibold px-3 py-1 rounded-full cursor-pointer border transition-all transform',
              'text-brand border-brand/40 hover:bg-brand/5 active:scale-95'
            )}
          >
            Edit Profile
          </button>
        )}
        renderTabContent={(activeTab) => (
          <div className={cn('w-full')}>
            {activeTab === 'photos' && (
              <div className={cn('flex flex-col items-end gap-4 w-full')}>
                <button
                  type="button"
                  onClick={() => navigate('/photos/new')}
                  className={cn(
                    'text-white text-xs font-semibold px-3 py-1 rounded-md cursor-pointer transition-all transform',
                    'bg-success hover:bg-success-hover active:scale-95'
                  )}
                >
                  Add Photo
                </button>
                <PhotoProfileGrid
                  items={photos as PhotoData[]}
                  isOwnProfile={true}
                  onItemClick={photoModal.openModal}
                />
              </div>
            )}

            {activeTab === 'albums' && (
              <div className={cn('flex flex-col items-end gap-4 w-full')}>
                <button
                  type="button"
                  onClick={() => navigate('/albums/new')}
                  className={cn(
                    'text-white text-xs font-semibold px-3 py-1 rounded-md cursor-pointer transition-all transform',
                    'bg-success hover:bg-success-hover active:scale-95'
                  )}
                >
                  Add Album
                </button>
                <AlbumProfileGrid
                  items={albums as AlbumData[]}
                  isOwnProfile={true}
                  onItemClick={albumModal.openModal}
                />
              </div>
            )}

            {activeTab === 'followings' && (
              <UserFollowGrid
                users={followings}
                context="my-profile"
                currentTab="followings"
                onAction={handleFollowToggle}
              />
            )}

            {activeTab === 'followers' && (
              <UserFollowGrid
                users={followers}
                context="my-profile"
                currentTab="followers"
                onAction={handleFollowToggle}
              />
            )}
          </div>
        )}
      />

      <PhotoModal
        isOpen={photoModal.isOpen}
        title={photoModal.selectedItem?.title || ''}
        description={photoModal.selectedItem?.description}
        imageUrl={photoModal.selectedItem?.media?.imageUrl || ''}
        onClose={photoModal.closeModal}
      />

      {albumModal.isOpen && (
        <AlbumModal
          isOpen={albumModal.isOpen}
          title={albumModal.selectedItem?.title || ''}
          description={albumModal.selectedItem?.description}
          imageUrls={profileAlbumImageUrls}
          onClose={albumModal.closeModal}
        />
      )}
    </>
  );
}
