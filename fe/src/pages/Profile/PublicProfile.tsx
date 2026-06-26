import React from 'react';
import { useParams } from 'react-router-dom';
import ProfileLayout from '../../components/layouts/ProfileLayout';
import PhotoProfileGrid from './components/PhotoProfileGrid';
import AlbumProfileGrid from './components/AlbumProfileGrid';
import UserFollowGrid from './components/UserFollowGrid';
import { useProfileData } from '../../hooks/useProfileData';

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
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
      <div className="p-8 text-center text-xs font-semibold text-gray-500">
        Loading public profile...
      </div>
    );
  }

  return (
    <ProfileLayout
      firstName={profileUser.first_name}
      lastName={profileUser.last_name}
      avatarUrl={profileUser.avatar_url}
      stats={stats}
      renderHeaderActions={() => (
        <button
          onClick={toggleFollowProfile}
          className={`text-xs font-bold px-4 py-1 rounded-full cursor-pointer transition-colors border ${
            isFollowingUser
              ? 'text-white bg-orange-500 border-orange-500 hover:bg-orange-600'
              : 'text-orange-500 border-orange-400 hover:bg-orange-50'
          }`}
        >
          {isFollowingUser ? 'Following' : 'Follow'}
        </button>
      )}
      renderTabContent={(activeTab) => (
        <div>
          {activeTab === 'photos' && (
            <PhotoProfileGrid items={photos} isOwnProfile={false} />
          )}
          {activeTab === 'albums' && (
            <AlbumProfileGrid items={albums} isOwnProfile={false} />
          )}

          {activeTab === 'followings' && (
            <UserFollowGrid
              users={followings}
              context="public-profile"
              currentTab="followings"
              onAction={handleFollowerToggle}
            />
          )}
          {activeTab === 'followers' && (
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
