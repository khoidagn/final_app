import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../components/layouts/ProfileLayout';
import PhotoProfileGrid from './components/PhotoProfileGrid';
import AlbumProfileGrid from './components/AlbumProfileGrid';
import UserFollowGrid from './components/UserFollowGrid';
import { useProfileData } from '../../hooks/useProfileData';

export default function MyProfile() {
  const navigate = useNavigate();
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
      <div className="p-8 text-center text-xs font-semibold text-gray-500">
        Loading profile...
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
          onClick={() => navigate('/my-profile/edit')}
          className="text-xs font-semibold text-blue-900 border border-blue-900/40 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-50"
        >
          Edit Profile
        </button>
      )}
      renderTabContent={(activeTab) => (
        <div>
          {activeTab === 'photos' && (
            <div className="flex flex-col items-end gap-4">
              <button
                onClick={() => navigate('/photos/new')}
                className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-md cursor-pointer hover:bg-emerald-700"
              >
                Add Photo
              </button>
              <PhotoProfileGrid items={photos} isOwnProfile={true} />
            </div>
          )}
          {activeTab === 'albums' && (
            <div className="flex flex-col items-end gap-4">
              <button
                onClick={() => navigate('/albums/new')}
                className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-md cursor-pointer hover:bg-emerald-700"
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
