import { Role, SharingMode } from '@prisma/client';
import prisma from '../config/prisma.js';
import { logInfo } from '../utils/logging.js';

const SERVICE_NAME = 'SearchService';

const attachPhotoInteractionStatus = async (
  photos: any[],
  currentUserId?: number
) => {
  if (!currentUserId || photos.length === 0) {
    return photos.map((photo) => ({
      ...photo,
      isLiked: false,
      user: photo.user ? { ...photo.user, isFollowing: false } : undefined,
    }));
  }

  const photoIds = photos.map((p) => p.id);
  const authorIds = photos
    .map((p) => p.userId)
    .filter((id) => id !== undefined && id !== null);

  const [userLikes, userFollowings] = await Promise.all([
    prisma.like.findMany({
      where: {
        userId: currentUserId,
        likeableType: 'PHOTO',
        likeableId: { in: photoIds },
      },
      select: { likeableId: true },
    }),
    prisma.follow.findMany({
      where: {
        followerId: currentUserId,
        followingId: { in: authorIds },
      },
      select: { followingId: true },
    }),
  ]);

  const likedPhotoIds = new Set(userLikes.map((l) => l.likeableId));
  const followingUserIds = new Set(userFollowings.map((f) => f.followingId));

  return photos.map((photo) => ({
    ...photo,
    isLiked: likedPhotoIds.has(photo.id),
    user: photo.user
      ? {
          ...photo.user,
          isFollowing:
            photo.userId === currentUserId
              ? false
              : followingUserIds.has(photo.userId),
        }
      : undefined,
  }));
};

const attachAlbumInteractionStatus = async (
  albums: any[],
  currentUserId?: number
) => {
  if (!currentUserId || albums.length === 0) {
    return albums.map((album) => ({
      ...album,
      isLiked: false,
      user: album.user ? { ...album.user, isFollowing: false } : undefined,
    }));
  }

  const albumIds = albums.map((a) => a.id);
  const authorIds = albums
    .map((a) => a.userId)
    .filter((id) => id !== undefined && id !== null);

  const [userLikes, userFollowings] = await Promise.all([
    prisma.like.findMany({
      where: {
        userId: currentUserId,
        likeableType: 'ALBUM',
        likeableId: { in: albumIds },
      },
      select: { likeableId: true },
    }),
    prisma.follow.findMany({
      where: {
        followerId: currentUserId,
        followingId: { in: authorIds },
      },
      select: { followingId: true },
    }),
  ]);

  const likedAlbumIds = new Set(userLikes.map((l) => l.likeableId));
  const followingUserIds = new Set(userFollowings.map((f) => f.followingId));

  return albums.map((album) => ({
    ...album,
    isLiked: likedAlbumIds.has(album.id),
    user: album.user
      ? {
          ...album.user,
          isFollowing:
            album.userId === currentUserId
              ? false
              : followingUserIds.has(album.userId),
        }
      : undefined,
  }));
};

export const searchService = {
  searchPhotosAndAlbums: async (
    searchQuery: string,
    currentUserId: number | undefined,
    currentUserRole: Role | undefined
  ) => {
    const cleanQuery = searchQuery.trim();

    logInfo(
      SERVICE_NAME,
      `Executing search for query: "${cleanQuery}" requested by User ID: ${currentUserId || 'Guest'}`
    );

    if (!cleanQuery) {
      return { photos: [], albums: [] };
    }

    let securityFilter: any[];

    if (currentUserRole === Role.ADMIN) {
      securityFilter = [{}];
    } else {
      securityFilter = [
        { sharingMode: SharingMode.PUBLIC },
        ...(currentUserId ? [{ userId: currentUserId }] : []),
      ];
    }

    const [rawPhotos, rawAlbums] = await Promise.all([
      prisma.photo.findMany({
        where: {
          OR: [
            { title: { contains: cleanQuery, mode: 'insensitive' } },
            { description: { contains: cleanQuery, mode: 'insensitive' } },
          ],
          AND: [{ OR: securityFilter }],
        },
        include: {
          media: { select: { imageUrl: true } },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      prisma.album.findMany({
        where: {
          OR: [
            { title: { contains: cleanQuery, mode: 'insensitive' } },
            { description: { contains: cleanQuery, mode: 'insensitive' } },
          ],
          AND: [{ OR: securityFilter }],
        },
        include: {
          albumMedias: {
            include: { media: true },
            orderBy: { position: 'asc' },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const [photos, albums] = await Promise.all([
      attachPhotoInteractionStatus(rawPhotos, currentUserId),
      attachAlbumInteractionStatus(rawAlbums, currentUserId),
    ]);

    logInfo(
      SERVICE_NAME,
      `Search completed. Found ${photos.length} photos and ${albums.length} albums.`
    );

    return { photos, albums };
  },
};
