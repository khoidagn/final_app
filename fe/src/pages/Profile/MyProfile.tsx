import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileLayout from '../../components/layouts/ProfileLayout';
import PhotoProfileGrid from './components/PhotoProfileGrid';
import AlbumProfileGrid from './components/AlbumProfileGrid';
import UserFollowGrid from './components/UserFollowGrid';
import { useProfileData } from '../../hooks/useProfileData';
import type { ProfileTab } from '../../types/profile';
import { cn } from '../../utils/cn';

export default function MyProfile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabQuery = (searchParams.get('tab') as ProfileTab) || 'photos';

  const {
    profileUser,
    stats,
    photos,
    albums,
    followings,
    followers,
    handleFollowAction,
    handleFollowerToggle,
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

  return (
    <ProfileLayout
      firstName={profileUser.first_name}
      lastName={profileUser.last_name}
      avatarUrl={profileUser.avatar_url}
      stats={stats}
      activeTab={tabQuery}
      onChangeTab={handleTabChange}
      renderHeaderActions={() => (
        <button
          onClick={() => navigate('/my-profile/edit')}
          className={cn(
            'text-xs font-semibold px-3 py-1 rounded-full cursor-pointer border transition-all transform',
            'text-brand border-brand/40 hover:bg-brand/5',
            'active:scale-95'
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
                onClick={() => navigate('/photos/new')}
                className={cn(
                  'text-white text-xs font-semibold px-3 py-1 rounded-md cursor-pointer transition-all transform',
                  'bg-success hover:bg-success-hover',
                  'active:scale-95'
                )}
              >
                Add Photo
              </button>
              <PhotoProfileGrid items={photos} isOwnProfile={true} />
            </div>
          )}

          {activeTab === 'albums' && (
            <div className={cn('flex flex-col items-end gap-4 w-full')}>
              <button
                onClick={() => navigate('/albums/new')}
                className={cn(
                  'text-white text-xs font-semibold px-3 py-1 rounded-md cursor-pointer transition-all transform',
                  'bg-success hover:bg-success-hover',
                  'active:scale-95'
                )}
              >
                Add Album
              </button>
              <AlbumProfileGrid items={albums} isOwnProfile={true} />
            </div>
          )}

          {activeTab === 'followings' && (
            <UserFollowGrid
              users={followings}
              context="my-profile"
              currentTab="followings"
              onAction={handleFollowAction}
            />
          )}

          {activeTab === 'followers' && (
            <UserFollowGrid
              users={followers}
              context="my-profile"
              currentTab="followers"
              onAction={handleFollowerToggle}
            />
          )}
        </div>
      )}
    />
  );
}
