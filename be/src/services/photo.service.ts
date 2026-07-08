import prisma from '../config/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import { SharingMode } from '@prisma/client';
import cloudinary from '../config/cloudinary.js';
import { getPublicIdFromUrl } from '../utils/cloudinary.helper.js';
import { logError } from '../utils/logging.js';
import { Role } from '@prisma/client';

interface CreatePhotoInput {
  title: string;
  description: string;
  imageUrl: string;
  userId: number;
  sharingMode?: SharingMode;
}

export const photoService = {
  createPhoto: async (data: CreatePhotoInput) => {
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

  getDiscoveryPhotos: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const whereCondition = { sharingMode: SharingMode.PUBLIC };

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

  getFeedsPhotos: async (userId: number, page: number, limit: number) => {
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

  getPhotoAndVerifyOwner: async (photoId: number, userId: number) => {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { media: true },
    });

    if (!photo) {
      throw new AppError(404, 'Photo not found.');
    }

    if (photo.userId !== userId) {
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

  updatePhoto: async (
    photoId: number,
    data: {
      title?: string;
      description?: string;
      sharingMode?: SharingMode;
      imageUrl?: string;
    }
  ) => {
    if (data.imageUrl) {
      const oldPhoto = await prisma.photo.findUnique({
        where: { id: photoId },
        include: { media: true },
      });

      if (oldPhoto?.media?.imageUrl) {
        const publicId = getPublicIdFromUrl(oldPhoto.media.imageUrl);
        await cloudinary.uploader.destroy(publicId);
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
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { media: true },
    });

    if (!photo) {
      logError(
        'PhotoService',
        `DeletePhoto - Photo not found with ID: ${photoId}`
      );
      throw new AppError(404, 'Photo not found.');
    }

    if (photo.userId !== currentUserId && currentUserRole !== Role.ADMIN) {
      logError(
        'PhotoService',
        `Forbidden delete attempt - User ID: ${currentUserId} with role: ${currentUserRole} tried to delete Photo ID: ${photoId}`
      );
      throw new AppError(
        403,
        'You do not have permission to delete this photo.'
      );
    }

    if (photo.media?.imageUrl) {
      const publicId = getPublicIdFromUrl(photo.media.imageUrl);
      await cloudinary.uploader.destroy(publicId);
    }

    return await prisma.photo.delete({
      where: { id: photoId },
    });
  },
};
