import prisma from '../config/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import cloudinary from '../config/cloudinary.js';
import { getPublicIdFromUrl } from '../utils/cloudinary.helper.js';
import { logError, logInfo } from '../utils/logging.js';
import { SharingMode } from '@prisma/client';
import { Role } from '@prisma/client';

interface CreateAlbumInput {
  title: string;
  description: string;
  userId: number;
  sharingMode?: SharingMode;
  imageUrls: string[];
}

const SERVICE_NAME = 'AlbumService';

const attachAlbumInteractionStatus = async (
  albums: any[],
  currentUserId?: number
) => {
  if (!currentUserId || albums.length === 0) {
    return albums.map((album) => ({
      ...album,
      isLiked: false,
      user: { ...album.user, isFollowing: false },
    }));
  }

  const albumIds = albums.map((a) => a.id);
  const authorIds = albums.map((a) => a.userId);

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
    user: {
      ...album.user,
      isFollowing:
        album.userId === currentUserId
          ? false
          : followingUserIds.has(album.userId),
    },
  }));
};

export const albumService = {
  createAlbum: async (data: CreateAlbumInput) => {
    logInfo(
      SERVICE_NAME,
      `Creating album "${data.title}" for User ID: ${data.userId}`
    );

    if (!data.imageUrls || data.imageUrls.length === 0) {
      logError(SERVICE_NAME, 'CreateAlbum failed: No images provided');
      throw new AppError(400, 'An album must contain at least one image.');
    }

    return await prisma.$transaction(async (tx) => {
      const album = await tx.album.create({
        data: {
          title: data.title,
          description: data.description,
          userId: data.userId,
          sharingMode: data.sharingMode || 'PUBLIC',
        },
      });

      const albumMediaData = await Promise.all(
        data.imageUrls.map(async (url, index) => {
          const media = await tx.media.create({
            data: { imageUrl: url },
          });
          return {
            albumId: album.id,
            mediaId: media.id,
            position: index,
          };
        })
      );

      await tx.albumMedia.createMany({
        data: albumMediaData,
      });

      return tx.album.findUnique({
        where: { id: album.id },
        include: {
          albumMedias: {
            include: { media: true },
            orderBy: { position: 'asc' },
          },
        },
      });
    });
  },

  getDiscoveryAlbums: async (
    page: number,
    limit: number,
    currentUserId?: number
  ) => {
    logInfo(
      SERVICE_NAME,
      `Fetching discovery albums - Page: ${page}, Limit: ${limit}`
    );
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      sharingMode: 'PUBLIC',
    };

    if (currentUserId) {
      whereCondition.userId = { not: currentUserId };
    }

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          albumMedias: {
            include: { media: true },
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.album.count({ where: whereCondition }),
    ]);

    const albumsWithStatus = await attachAlbumInteractionStatus(
      albums,
      currentUserId
    );

    return {
      albums: albumsWithStatus,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  },

  getFeedsAlbums: async (userId: number, page: number, limit: number) => {
    logInfo(SERVICE_NAME, `Fetching feeds albums for User ID: ${userId}`);
    const skip = (page - 1) * limit;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return { albums: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where: { userId: { in: followingIds }, sharingMode: 'PUBLIC' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          albumMedias: {
            include: { media: true },
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.album.count({
        where: { userId: { in: followingIds }, sharingMode: 'PUBLIC' },
      }),
    ]);

    const albumsWithStatus = await attachAlbumInteractionStatus(albums, userId);

    return {
      albums: albumsWithStatus,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  },

  getAlbumsByUserId: async (
    targetUserId: number,
    currentUserId: number,
    page: number,
    limit: number
  ) => {
    logInfo(
      SERVICE_NAME,
      `Fetching albums for Target User ID: ${targetUserId} requested by User ID: ${currentUserId}`
    );
    const skip = (page - 1) * limit;

    const isOwner = targetUserId === currentUserId;
    const whereCondition: any = { userId: targetUserId };

    if (!isOwner) {
      whereCondition.sharingMode = SharingMode.PUBLIC;
    }

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where: whereCondition,
        include: {
          albumMedias: {
            include: { media: true },
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.album.count({ where: whereCondition }),
    ]);

    return {
      albums,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  },

  getAlbumById: async (
    albumId: number,
    currentUserId: number,
    currentUserRole?: Role
  ) => {
    logInfo(SERVICE_NAME, `Fetching album details for Album ID: ${albumId}`);

    const album = await prisma.album.findUnique({
      where: { id: albumId },
      include: {
        albumMedias: { include: { media: true }, orderBy: { position: 'asc' } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!album) {
      logError(
        SERVICE_NAME,
        `GetAlbumById failed - Album not found: ${albumId}`
      );
      throw new AppError(404, 'Album not found.');
    }

    if (
      album.sharingMode === 'PRIVATE' &&
      album.userId !== currentUserId &&
      currentUserRole !== Role.ADMIN
    ) {
      logError(
        SERVICE_NAME,
        `GetAlbumById Forbidden - User ${currentUserId} role ${currentUserRole} unauthorized for private album ${albumId}`
      );
      throw new AppError(
        403,
        'Forbidden: You do not have permission to view this album.'
      );
    }

    return album;
  },

  updateAlbum: async (
    albumId: number,
    userId: number,
    currentUserRole: Role,
    data: {
      title?: string;
      description?: string;
      sharingMode?: SharingMode;
      remainingImageIds?: number[];
      newImageUrls?: string[];
    }
  ) => {
    logInfo(
      SERVICE_NAME,
      `Updating album ID: ${albumId} requested by User ID: ${userId} (Role: ${currentUserRole})`
    );

    const album = await prisma.album.findUnique({ where: { id: albumId } });
    if (!album) {
      logError(SERVICE_NAME, `UpdateAlbum failed - Not found: ${albumId}`);
      throw new AppError(404, 'Album not found.');
    }

    if (album.userId !== userId && currentUserRole !== Role.ADMIN) {
      logError(
        SERVICE_NAME,
        `UpdateAlbum Forbidden - User ${userId} with role ${currentUserRole} does not own Album ${albumId}`
      );
      throw new AppError(
        403,
        'You do not have permission to modify this album.'
      );
    }

    const updateData: any = {};
    if (data.title !== undefined && data.title.trim() !== '')
      updateData.title = data.title;
    if (data.description !== undefined && data.description.trim() !== '')
      updateData.description = data.description;
    if (
      data.sharingMode !== undefined &&
      String(data.sharingMode).trim() !== ''
    )
      updateData.sharingMode = data.sharingMode;

    let imageUrlsToDelete: string[] = [];

    const updatedAlbumResult = await prisma.$transaction(async (tx) => {
      await tx.album.update({
        where: { id: albumId },
        data: updateData,
      });

      if (data.remainingImageIds !== undefined) {
        const currentAlbumMedias = await tx.albumMedia.findMany({
          where: { albumId },
          include: { media: true },
        });

        const currentMediaIds = currentAlbumMedias.map((am) => am.mediaId);
        const mediaIdsToDelete = currentMediaIds.filter(
          (id) => !data.remainingImageIds!.includes(id)
        );

        if (mediaIdsToDelete.length > 0) {
          logInfo(
            SERVICE_NAME,
            `Detected ${mediaIdsToDelete.length} images to remove from Album ${albumId}: [${mediaIdsToDelete.join(', ')}]`
          );

          imageUrlsToDelete = currentAlbumMedias
            .filter(
              (am) =>
                mediaIdsToDelete.includes(am.mediaId) && am.media?.imageUrl
            )
            .map((am) => am.media!.imageUrl);

          await tx.albumMedia.deleteMany({
            where: {
              albumId,
              mediaId: { in: mediaIdsToDelete },
            },
          });

          await tx.media.deleteMany({
            where: {
              id: { in: mediaIdsToDelete },
            },
          });

          logInfo(
            SERVICE_NAME,
            `Successfully deleted association and media records in database for Album ${albumId}`
          );
        } else {
          logInfo(
            SERVICE_NAME,
            `No existing images were removed during this update.`
          );
        }
      }

      if (data.newImageUrls && data.newImageUrls.length > 0) {
        const lastMedia = await tx.albumMedia.findFirst({
          where: { albumId },
          orderBy: { position: 'desc' },
        });
        let currentPosition = lastMedia ? lastMedia.position + 1 : 1;

        logInfo(
          SERVICE_NAME,
          `Inserting ${data.newImageUrls.length} new images into Album ${albumId} starting at position ${currentPosition}`
        );

        for (const url of data.newImageUrls) {
          const newMedia = await tx.media.create({
            data: { imageUrl: url },
          });

          await tx.albumMedia.create({
            data: {
              albumId,
              mediaId: newMedia.id,
              position: currentPosition++,
            },
          });
        }
      }

      return await tx.album.findUnique({
        where: { id: albumId },
        include: {
          albumMedias: {
            include: { media: true },
            orderBy: { position: 'asc' },
          },
        },
      });
    });

    if (imageUrlsToDelete.length > 0) {
      logInfo(
        SERVICE_NAME,
        `Transaction succeeded. Starting to clean up ${imageUrlsToDelete.length} assets from Cloudinary...`
      );
      for (const url of imageUrlsToDelete) {
        try {
          const publicId = getPublicIdFromUrl(url);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            logInfo(
              SERVICE_NAME,
              `Successfully destroyed asset on Cloudinary: ${publicId}`
            );
          }
        } catch (cloudinaryError: any) {
          logError(
            SERVICE_NAME,
            `Failed to destroy Cloudinary asset for URL ${url}: ${cloudinaryError?.message || cloudinaryError}`
          );
        }
      }
    }

    return updatedAlbumResult;
  },

  deleteAlbum: async (
    albumId: number,
    currentUserId: number,
    currentUserRole: Role
  ) => {
    logInfo(
      SERVICE_NAME,
      `DeleteAlbum requested for Album ID: ${albumId} by User ID: ${currentUserId}`
    );

    const album = await prisma.album.findUnique({
      where: { id: albumId },
      include: {
        albumMedias: { include: { media: true } },
      },
    });

    if (!album) {
      logError(SERVICE_NAME, `DeleteAlbum - Album not found: ${albumId}`);
      throw new AppError(404, 'Album not found.');
    }

    if (album.userId !== currentUserId && currentUserRole !== Role.ADMIN) {
      logError(
        SERVICE_NAME,
        `DeleteAlbum - Forbidden: User ${currentUserId} with role ${currentUserRole} requested to delete Album ${albumId}`
      );
      throw new AppError(
        403,
        'You do not have permission to delete this album.'
      );
    }

    const mediaIds = album.albumMedias.map((am) => am.mediaId);
    const imageUrls = album.albumMedias.map((am) => am.media.imageUrl);

    const deleteCloudinaryPromises = imageUrls.map((url) => {
      const publicId = getPublicIdFromUrl(url);
      return cloudinary.uploader.destroy(publicId);
    });
    await Promise.all(deleteCloudinaryPromises);
    logInfo(SERVICE_NAME, `Cleared Cloudinary files for Album ID: ${albumId}`);

    return await prisma.$transaction(async (tx) => {
      const deletedAlbum = await tx.album.delete({
        where: { id: albumId },
      });

      await tx.media.deleteMany({
        where: { id: { in: mediaIds } },
      });

      logInfo(
        SERVICE_NAME,
        `Successfully deleted Album ${albumId} and its associated Media records`
      );
      return deletedAlbum;
    });
  },
};
