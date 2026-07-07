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

export const albumService = {
  createAlbum: async (data: CreateAlbumInput) => {
    logInfo(
      'AlbumService',
      `Creating album "${data.title}" for User ID: ${data.userId}`
    );

    if (!data.imageUrls || data.imageUrls.length === 0) {
      logError('AlbumService', 'CreateAlbum failed: No images provided');
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

  getDiscoveryAlbums: async (page: number, limit: number) => {
    logInfo(
      'AlbumService',
      `Fetching discovery albums - Page: ${page}, Limit: ${limit}`
    );
    const skip = (page - 1) * limit;

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where: { sharingMode: 'PUBLIC' },
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
      prisma.album.count({ where: { sharingMode: 'PUBLIC' } }),
    ]);

    return {
      albums,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  },

  getFeedsAlbums: async (userId: number, page: number, limit: number) => {
    logInfo('AlbumService', `Fetching feeds albums for User ID: ${userId}`);
    const skip = (page - 1) * limit;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where: {
          userId: { in: followingIds },
          sharingMode: 'PUBLIC',
        },
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
        where: {
          userId: { in: followingIds },
          sharingMode: 'PUBLIC',
        },
      }),
    ]);

    return {
      albums,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  },

  getMyAlbums: async (userId: number, page: number, limit: number) => {
    logInfo('AlbumService', `Fetching personal albums for User ID: ${userId}`);
    const skip = (page - 1) * limit;

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where: { userId },
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
      prisma.album.count({ where: { userId } }),
    ]);

    return {
      albums,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  },

  updateAlbum: async (
    albumId: number,
    userId: number,
    data: { title?: string; description?: string; sharingMode?: SharingMode }
  ) => {
    logInfo(
      'AlbumService',
      `Updating album ID: ${albumId} by User ID: ${userId}`
    );

    const album = await prisma.album.findUnique({ where: { id: albumId } });
    if (!album) {
      logError('AlbumService', `UpdateAlbum failed - Not found: ${albumId}`);
      throw new AppError(404, 'Album not found.');
    }
    if (album.userId !== userId) {
      logError(
        'AlbumService',
        `UpdateAlbum Forbidden - User ${userId} handles Album ${albumId}`
      );
      throw new AppError(403, 'You do not own this album.');
    }

    return await prisma.album.update({
      where: { id: albumId },
      data,
      include: {
        albumMedias: { include: { media: true }, orderBy: { position: 'asc' } },
      },
    });
  },

  deleteAlbum: async (
    albumId: number,
    currentUserId: number,
    currentUserRole: Role
  ) => {
    const album = await prisma.album.findUnique({
      where: { id: albumId },
      include: {
        albumMedias: { include: { media: true } },
      },
    });

    if (!album) {
      logError('AlbumService', `DeleteAlbum - Album not found: ${albumId}`);
      throw new AppError(404, 'Album not found.');
    }

    if (album.userId !== currentUserId && currentUserRole !== Role.ADMIN) {
      logError(
        'AlbumService',
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
    logInfo(
      'AlbumService',
      `Cleared Cloudinary files for Album ID: ${albumId}`
    );

    return await prisma.$transaction(async (tx) => {
      const deletedAlbum = await tx.album.delete({
        where: { id: albumId },
      });

      await tx.media.deleteMany({
        where: { id: { in: mediaIds } },
      });

      logInfo(
        'AlbumService',
        `Successfully deleted Album ${albumId} and its associated Media records`
      );
      return deletedAlbum;
    });
  },
};
