import { useParams, useSearchParams } from 'react-router-dom';
import ProfileViewLayout from '../../components/layouts/ProfileVIewLayout';
import PhotoProfileGrid from './components/PhotoProfileGrid';
import AlbumProfileGrid from './components/AlbumProfileGrid';
import UserFollowGrid from './components/UserFollowGrid';
import FollowButton from '../../components/ui/FollowButton';
import PhotoModal from '../Photos/PhotoModal';
import AlbumModal from '../Albums/AlbumModal';
import { useProfileData } from './hooks/useProfileData';
import { useModalState } from '../../hooks/useModalState';
import type { ProfileTab } from '../../types/profile.type';
import { cn } from '../../utils/cn';
import type { PhotoData } from '../../types/photo.type';
import type { AlbumData } from '../../types/album.type';

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as ProfileTab) || 'photos';
  const photoModal = useModalState<PhotoData>();
  const albumModal = useModalState<AlbumData>();

  const {
    profileUser,
    stats,
    photos,
    albums,
    followings,
    followers,
    isFollowingUser,
    toggleFollowProfile,
    handleFollowToggle,
    isLoading,
  } = useProfileData({ isOwnProfile: false, userId });

  if (isLoading || !profileUser) {
    return (
      <div
        className={cn('p-8 text-center text-xs font-semibold text-text-muted')}
      >
        Loading public profile...
      </div>
    );
  }

  const handleTabChange = (newTab: ProfileTab) => {
    setSearchParams({ tab: newTab });
  };

  const publicAlbumImageUrls =
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
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        renderHeaderActions={() => (
          <FollowButton
            isFollowing={isFollowingUser}
            onToggle={toggleFollowProfile}
            textSizeClass="text-xs px-4"
          />
        )}
        renderTabContent={(currentTab) => (
          <div className={cn('w-full')}>
            {currentTab === 'photos' && (
              <PhotoProfileGrid
                items={photos as PhotoData[]}
                isOwnProfile={false}
                onItemClick={photoModal.openModal}
              />
            )}

            {currentTab === 'albums' && (
              <AlbumProfileGrid
                items={albums as AlbumData[]}
                isOwnProfile={false}
                onItemClick={albumModal.openModal}
              />
            )}

            {currentTab === 'followings' && (
              <UserFollowGrid
                users={followings}
                context="public-profile"
                currentTab="followings"
                onAction={handleFollowToggle}
              />
            )}

            {currentTab === 'followers' && (
              <UserFollowGrid
                users={followers}
                context="public-profile"
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

      <AlbumModal
        isOpen={albumModal.isOpen}
        title={albumModal.selectedItem?.title || ''}
        description={albumModal.selectedItem?.description}
        imageUrls={publicAlbumImageUrls}
        onClose={albumModal.closeModal}
      />
    </>
  );
}
