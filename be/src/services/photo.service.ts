import prisma from '../config/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import { SharingMode } from '@prisma/client';
import cloudinary from '../config/cloudinary.js';
import { getPublicIdFromUrl } from '../utils/cloudinary.helper.js';
import { logError, logInfo } from '../utils/logging.js';
import { Role } from '@prisma/client';

interface CreatePhotoInput {
  title: string;
  description: string;
  imageUrl: string;
  userId: number;
  sharingMode?: SharingMode;
}

const SERVICE_NAME = 'PhotoService';

const attachInteractionStatus = async (
  photos: any[],
  currentUserId?: number
) => {
  if (!currentUserId || photos.length === 0) {
    return photos.map((photo) => ({
      ...photo,
      isLiked: false,
      user: { ...photo.user, isFollowing: false },
    }));
  }

  const photoIds = photos.map((p) => p.id);
  const authorIds = photos.map((p) => p.userId);

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
    user: {
      ...photo.user,
      isFollowing:
        photo.userId === currentUserId
          ? false
          : followingUserIds.has(photo.userId),
    },
  }));
};

export const photoService = {
  createPhoto: async (data: CreatePhotoInput) => {
    logInfo(
      SERVICE_NAME,
      `Creating photo "${data.title}" for User ID: ${data.userId}`
    );

    return await prisma.photo.create({
      data: {
        title: data.title,
        description: data.description,
        sharingMode: data.sharingMode || 'PUBLIC',
        media: {
          create: {
            imageUrl: data.imageUrl,
          },
        },
        user: {
          connect: { id: data.userId },
        },
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        media: {
          select: { id: true, imageUrl: true },
        },
      },
    });
  },

  getDiscoveryPhotos: async (
    page: number,
    limit: number,
    currentUserId?: number
  ) => {
    logInfo(
      SERVICE_NAME,
      `Fetching discovery photos - Page: ${page}, Limit: ${limit}`
    );
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      sharingMode: SharingMode.PUBLIC,
    };

    if (currentUserId) {
      whereCondition.userId = { not: currentUserId };
    }

    const [total, photos] = await Promise.all([
      prisma.photo.count({ where: whereCondition }),
      prisma.photo.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          media: { select: { id: true, imageUrl: true } },
        },
      }),
    ]);

    const photosWithStatus = await attachInteractionStatus(
      photos,
      currentUserId
    );

    return {
      photos: photosWithStatus,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getFeedsPhotos: async (userId: number, page: number, limit: number) => {
    logInfo(SERVICE_NAME, `Fetching feeds photos for User ID: ${userId}`);
    const skip = (page - 1) * limit;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return {
        photos: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }

    const whereCondition = {
      userId: { in: followingIds },
      sharingMode: SharingMode.PUBLIC,
    };

    const [total, photos] = await Promise.all([
      prisma.photo.count({ where: whereCondition }),
      prisma.photo.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          media: { select: { id: true, imageUrl: true } },
        },
      }),
    ]);

    const photosWithStatus = await attachInteractionStatus(photos, userId);

    return {
      photos: photosWithStatus,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getPhotoAndVerifyOwner: async (photoId: number, userId: number) => {
    logInfo(
      SERVICE_NAME,
      `Verifying photo ownership - Photo ID: ${photoId}, User ID: ${userId}`
    );

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { media: true },
    });

    if (!photo) {
      logError(
        SERVICE_NAME,
        `Verification failed - Photo not found: ${photoId}`
      );
      throw new AppError(404, 'Photo not found.');
    }

    if (photo.userId !== userId) {
      logError(
        SERVICE_NAME,
        `Verification failed - User ID ${userId} does not own Photo ID ${photoId}`
      );
      throw new AppError(403, 'Forbidden: You do not own this photo resource.');
    }

    return photo;
  },

  getPhotosByUserId: async (
    targetUserId: number,
    currentUserId: number,
    page: number,
    limit: number
  ) => {
    logInfo(
      SERVICE_NAME,
      `Fetching photos for Target User ID: ${targetUserId} requested by User ID: ${currentUserId}`
    );
    const skip = (page - 1) * limit;
    const isOwner = targetUserId === currentUserId;
    const whereCondition: any = { userId: targetUserId };

    if (!isOwner) {
      whereCondition.sharingMode = SharingMode.PUBLIC;
    }

    const [total, photos] = await Promise.all([
      prisma.photo.count({ where: whereCondition }),
      prisma.photo.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          media: {
            select: { id: true, imageUrl: true },
          },
        },
      }),
    ]);

    return {
      photos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getPhotoById: async (
    photoId: number,
    currentUserId: number,
    currentUserRole?: Role
  ) => {
    logInfo(SERVICE_NAME, `Fetching photo details for Photo ID: ${photoId}`);

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: {
        media: { select: { id: true, imageUrl: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!photo) {
      logError(
        SERVICE_NAME,
        `GetPhotoById failed - Photo not found: ${photoId}`
      );
      throw new AppError(404, 'Photo not found.');
    }

    if (
      photo.sharingMode === 'PRIVATE' &&
      photo.userId !== currentUserId &&
      currentUserRole !== Role.ADMIN
    ) {
      logError(
        SERVICE_NAME,
        `GetPhotoById Forbidden - User ${currentUserId} role ${currentUserRole} unauthorized for private photo ${photoId}`
      );
      throw new AppError(
        403,
        'Forbidden: You do not have permission to view this photo.'
      );
    }

    return photo;
  },

  updatePhoto: async (
    photoId: number,
    currentUserId: number,
    currentUserRole: Role,
    data: {
      title?: string;
      description?: string;
      sharingMode?: SharingMode;
      imageUrl?: string;
    }
  ) => {
    logInfo(
      SERVICE_NAME,
      `Updating photo ID: ${photoId} requested by User ID: ${currentUserId} (Role: ${currentUserRole})`
    );

    const oldPhoto = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { media: true },
    });

    if (!oldPhoto) {
      logError(SERVICE_NAME, `UpdatePhoto failed - Not found: ${photoId}`);
      throw new AppError(404, 'Photo not found.');
    }

    if (oldPhoto.userId !== currentUserId && currentUserRole !== Role.ADMIN) {
      logError(
        SERVICE_NAME,
        `UpdatePhoto Forbidden - User ${currentUserId} with role ${currentUserRole} does not own Photo ${photoId}`
      );
      throw new AppError(
        403,
        'You do not have permission to update this photo.'
      );
    }

    if (data.imageUrl && oldPhoto.media?.imageUrl) {
      try {
        const publicId = getPublicIdFromUrl(oldPhoto.media.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          logInfo(
            SERVICE_NAME,
            `Successfully destroyed old asset on Cloudinary: ${publicId}`
          );
        }
      } catch (cloudError) {
        logError(
          SERVICE_NAME,
          `Failed to delete old photo on Cloudinary: ${cloudError}`
        );
      }
    }

    const updateData: any = {};

    if (data.title !== undefined && data.title.trim() !== '') {
      updateData.title = data.title;
    }

    if (data.description !== undefined && data.description.trim() !== '') {
      updateData.description = data.description;
    }

    if (
      data.sharingMode !== undefined &&
      String(data.sharingMode).trim() !== ''
    ) {
      updateData.sharingMode = data.sharingMode;
    }

    if (data.imageUrl) {
      updateData.media = {
        update: { imageUrl: data.imageUrl },
      };
    }

    return await prisma.photo.update({
      where: { id: photoId },
      data: updateData,
      include: {
        media: { select: { imageUrl: true } },
      },
    });
  },

  deletePhoto: async (
    photoId: number,
    currentUserId: number,
    currentUserRole: Role
  ) => {
    logInfo(
      SERVICE_NAME,
      `DeletePhoto requested for Photo ID: ${photoId} by User ID: ${currentUserId}`
    );

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { media: true },
    });

    if (!photo) {
      logError(
        SERVICE_NAME,
        `DeletePhoto failed - Photo not found with ID: ${photoId}`
      );
      throw new AppError(404, 'Photo not found.');
    }

    if (photo.userId !== currentUserId && currentUserRole !== Role.ADMIN) {
      logError(
        SERVICE_NAME,
        `Forbidden delete attempt - User ID: ${currentUserId} with role: ${currentUserRole} tried to delete Photo ID: ${photoId}`
      );
      throw new AppError(
        403,
        'You do not have permission to delete this photo.'
      );
    }

    if (photo.media?.imageUrl) {
      try {
        const publicId = getPublicIdFromUrl(photo.media.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          logInfo(
            SERVICE_NAME,
            `Cleared Cloudinary file for Photo ID: ${photoId}`
          );
        }
      } catch (cloudError) {
        logError(
          SERVICE_NAME,
          `Failed to clear Cloudinary file for Photo ID ${photoId}: ${cloudError}`
        );
      }
    }

    return await prisma.photo.delete({
      where: { id: photoId },
    });
  },
};
