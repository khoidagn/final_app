import { useParams, useSearchParams } from 'react-router-dom';
import ProfileLayout from '../../components/layouts/ProfileLayout';
import PhotoProfileGrid from './components/PhotoProfileGrid';
import AlbumProfileGrid from './components/AlbumProfileGrid';
import UserFollowGrid from './components/UserFollowGrid';
import FollowButton from '../../components/ui/FollowButton';
import { useProfileData } from '../../hooks/useProfileData';
import type { ProfileTab } from '../../types/profile';
import { cn } from '../../utils/cn';

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get('tab') as ProfileTab) || 'photos';

  const {
    profileUser,
    stats,
    photos,
    albums,
    followings,
    followers,
    isFollowingUser,
    toggleFollowProfile,
    handleFollowerToggle,
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

  return (
    <ProfileLayout
      firstName={profileUser.first_name}
      lastName={profileUser.last_name}
      avatarUrl={profileUser.avatar_url}
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
            <PhotoProfileGrid items={photos} isOwnProfile={false} />
          )}

          {currentTab === 'albums' && (
            <AlbumProfileGrid items={albums} isOwnProfile={false} />
          )}

          {currentTab === 'followings' && (
            <UserFollowGrid
              users={followings}
              context="public-profile"
              currentTab="followings"
              onAction={handleFollowerToggle}
            />
          )}

          {currentTab === 'followers' && (
            <UserFollowGrid
              users={followers}
              context="public-profile"
              currentTab="followers"
              onAction={handleFollowerToggle}
            />
          )}
        </div>
      )}
    />
  );
}
