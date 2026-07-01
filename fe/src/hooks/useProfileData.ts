import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service';
import type {
  ProfileStats,
  ProfileCardData,
  UserFollowData,
} from '../types/profile';

interface UseProfileDataProps {
  isOwnProfile: boolean;
  userId?: string;
}

export function useProfileData({ isOwnProfile, userId }: UseProfileDataProps) {
  const [profileUser, setProfileUser] = useState<{
    first_name: string;
    last_name: string;
    avatar_url: string;
  } | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    photos: 0,
    albums: 0,
    followings: 0,
    followers: 0,
  });

  const [photos, setPhotos] = useState<ProfileCardData[]>([]);
  const [albums, setAlbums] = useState<ProfileCardData[]>([]);
  const [followings, setFollowings] = useState<UserFollowData[]>([]);
  const [followers, setFollowers] = useState<UserFollowData[]>([]);

  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const userData = isOwnProfile
          ? await profileService.getMyProfile()
          : await profileService.getPublicProfile(userId);

        setProfileUser({
          first_name: userData.first_name,
          last_name: userData.last_name,
          avatar_url: userData.avatar_url,
        });
        setStats(userData.stats);
        if (!isOwnProfile) setIsFollowingUser(userData.is_following || false);

        const [rawPhotos, rawAlbums, rawFollowings, rawFollowers] =
          await Promise.all([
            profileService.getProfileContent('photos'),
            profileService.getProfileContent('albums'),
            profileService.getProfileContent('followings'),
            profileService.getProfileContent('followers'),
          ]);

        setPhotos(
          isOwnProfile
            ? rawPhotos
            : rawPhotos.filter((p: unknown) => !p.is_private)
        );
        setAlbums(
          isOwnProfile
            ? rawAlbums
            : rawAlbums.filter((a: unknown) => !a.is_private)
        );
        setFollowings(rawFollowings);
        setFollowers(rawFollowers);
      } catch (err) {
        console.error('Lỗi nạp thông tin profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [isOwnProfile, userId]);

  const handleFollowAction = (targetUserId: number) => {
    setFollowings((prev) => prev.filter((u) => u.id !== targetUserId));
    setStats((prev) => ({
      ...prev,
      followings: Math.max(0, prev.followings - 1),
    }));
  };

  const handleFollowerToggle = (
    targetUserId: number,
    currentStatus: boolean
  ) => {
    setFollowers((prev) =>
      prev.map((u) =>
        u.id === targetUserId ? { ...u, is_following: !currentStatus } : u
      )
    );
  };

  const toggleFollowProfile = () => {
    setIsFollowingUser((prev) => !prev);
    setStats((prev) => ({
      ...prev,
      followers: prev.followers + (isFollowingUser ? -1 : 1),
    }));
  };

  return {
    profileUser,
    stats,
    photos,
    albums,
    followings,
    followers,
    isFollowingUser,
    toggleFollowProfile,
    handleFollowAction,
    handleFollowerToggle,
    isLoading,
  };
}
