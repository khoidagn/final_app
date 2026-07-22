import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../../../services/user.service';
import { photoService } from '../../../services/photo.service';
import { albumService } from '../../../services/album.service';
import { interactionService } from '../../../services/interaction.service';
import { PROFILE_CONSTANTS } from '../../../constants/profile.constant';
import { getBackendMessage } from '../../../utils/error';
import type { ProfileStats } from '../../../types/profile.type';
import type { UserFollowData } from '../../../types/user.type';
import type { PhotoData } from '../../../types/photo.type';
import type { AlbumData } from '../../../types/album.type';

interface UseProfileDataProps {
  isOwnProfile: boolean;
  userId?: string | number;
}

export function useProfileData({ isOwnProfile, userId }: UseProfileDataProps) {
  const [profileUser, setProfileUser] = useState<{
    firstName: string;
    lastName: string;
    avatarUrl: string;
  } | null>(null);

  const [stats, setStats] = useState<ProfileStats>({
    photos: 0,
    albums: 0,
    followings: 0,
    followers: 0,
  });

  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [followings, setFollowings] = useState<UserFollowData[]>([]);
  const [followers, setFollowers] = useState<UserFollowData[]>([]);

  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const targetId = userId ? parseInt(userId.toString(), 10) : undefined;

        const userResponse = isOwnProfile
          ? await userService.getMe()
          : await userService.getUserById(targetId!);

        const userData = userResponse?.data;

        if (userData) {
          setProfileUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatarUrl: userData.avatarUrl,
          });

          if (!isOwnProfile) {
            setIsFollowingUser(userData.isFollowing ?? false);
          }
          setStats({
            photos: userData._count?.photos ?? 0,
            albums: userData._count?.albums ?? 0,
            followers: userData._count?.followers ?? 0,
            followings: userData._count?.following ?? 0,
          });
        }
        const [
          rawPhotos,
          rawAlbums,
          connectionsFollowings,
          connectionsFollowers,
        ] = await Promise.all([
          isOwnProfile
            ? photoService.getMyPhotos()
            : photoService.getUserPhotos(targetId!),
          isOwnProfile
            ? albumService.getMyAlbums()
            : albumService.getUserAlbums(targetId!),
          isOwnProfile
            ? userService.getMyFollowing(1)
            : userService.getUserFollowing(targetId!, 1),
          isOwnProfile
            ? userService.getMyFollowers(1)
            : userService.getUserFollowers(targetId!, 1),
        ]);

        const photosData = rawPhotos?.data?.photos || [];
        const albumsData = rawAlbums?.data?.albums || [];
        const followingsList = connectionsFollowings?.data || [];
        const followersList = connectionsFollowers?.data || [];

        setPhotos(photosData);
        setAlbums(albumsData);
        setFollowings(followingsList);
        setFollowers(followersList);
      } catch (err: unknown) {
        toast.error(
          getBackendMessage(
            err,
            PROFILE_CONSTANTS.API_RESPONSE.FETCH_PROFILE_FAILED
          )
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [isOwnProfile, userId]);

  const handleFollowToggle = async (
    targetUserId: number,
    currentStatus: boolean
  ) => {
    try {
      const res = await interactionService.toggleFollowUser(targetUserId);
      const nextStatus =
        res && typeof res.followed === 'boolean'
          ? res.followed
          : !currentStatus;

      setFollowers((prev) =>
        prev.map((u) =>
          u.id === targetUserId ? { ...u, isFollowing: nextStatus } : u
        )
      );

      if (isOwnProfile) {
        if (!nextStatus) {
          setFollowings((prev) => prev.filter((u) => u.id !== targetUserId));
        } else {
          setFollowings((prev) =>
            prev.map((u) =>
              u.id === targetUserId ? { ...u, isFollowing: nextStatus } : u
            )
          );
        }

        setStats((prev) => ({
          ...prev,
          followings: nextStatus
            ? prev.followings + 1
            : Math.max(0, prev.followings - 1),
        }));
      } else {
        setFollowings((prev) =>
          prev.map((u) =>
            u.id === targetUserId ? { ...u, isFollowing: nextStatus } : u
          )
        );
      }
    } catch (error: unknown) {
      toast.error(getBackendMessage(error, 'Failed to update follow status.'));
    }
  };

  const toggleFollowProfile = async () => {
    if (isOwnProfile || !userId) return;
    try {
      const targetId = parseInt(userId.toString(), 10);
      const res = await interactionService.toggleFollowUser(targetId);
      const nextStatus =
        res && typeof res.followed === 'boolean'
          ? res.followed
          : !isFollowingUser;

      setIsFollowingUser(nextStatus);
      setStats((prev) => ({
        ...prev,
        followers: nextStatus
          ? prev.followers + 1
          : Math.max(0, prev.followers - 1),
      }));
    } catch (error: unknown) {
      toast.error(getBackendMessage(error, 'Failed to follow user.'));
    }
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
    handleFollowToggle,
    isLoading,
  };
}
