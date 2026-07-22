import { Role } from '@prisma/client';
import prisma from '../config/prisma.js';
import { logInfo, logError } from '../utils/logging.js';
import { AppError } from '../middlewares/error.middleware.js';
import { MailService } from '../utils/mail.js';
import { MailTemplates } from '../utils/mail-templates.js';

const SERVICE_NAME = 'AdminService';

export const adminService = {
  getAllUsersMaster: async (page: number, limit: number) => {
    logInfo(
      SERVICE_NAME,
      `Master inspection - Fetching ALL users. Page: ${page}, Limit: ${limit}`
    );
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          lastLogin: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              photos: true,
              albums: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    const formattedUsers = users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      lastLogin: u.lastLogin,
      isActive: u.isActive,
      createdAt: u.createdAt,
      photosCount: u._count?.photos || 0,
      albumsCount: u._count?.albums || 0,
    }));

    return {
      users: formattedUsers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getAllPhotosMaster: async (page: number, limit: number) => {
    logInfo(
      SERVICE_NAME,
      `Master inspection - Fetching ALL photos. Page: ${page}, Limit: ${limit}`
    );
    const skip = (page - 1) * limit;

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        include: { user: { select: { id: true, email: true } }, media: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.photo.count(),
    ]);

    return {
      photos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getAllAlbumsMaster: async (page: number, limit: number) => {
    logInfo(
      SERVICE_NAME,
      `Master inspection - Fetching ALL albums. Page: ${page}, Limit: ${limit}`
    );
    const skip = (page - 1) * limit;

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        include: {
          user: { select: { id: true, email: true } },
          albumMedias: { include: { media: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.album.count(),
    ]);

    return {
      albums,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getUserByIdMaster: async (targetUserId: number) => {
    logInfo(
      SERVICE_NAME,
      `Master inspection - Fetching detail for User ID: ${targetUserId}`
    );

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    if (!user) {
      logError(
        SERVICE_NAME,
        `Fetch user detail failed - User not found: ${targetUserId}`
      );
      throw new AppError(404, 'User not found.');
    }

    return user;
  },

  toggleUserStatus: async (targetUserId: number, isActive: boolean) => {
    logInfo(
      SERVICE_NAME,
      `Admin requested status change for User ID: ${targetUserId} to: ${isActive}`
    );

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      logError(
        SERVICE_NAME,
        `User status toggle failed - User not found: ${targetUserId}`
      );
      throw new AppError(404, 'User not found.');
    }

    if (user.role === Role.ADMIN) {
      logError(
        SERVICE_NAME,
        `User status toggle forbidden - Target User ID: ${targetUserId} is an Administrator`
      );
      throw new AppError(
        400,
        'You cannot suspend or modify another Admin account.'
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { isActive },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
      },
    });

    const emailHtml = MailTemplates.getAccountStatusEmail({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isActive: updatedUser.isActive,
    });

    const subject = updatedUser.isActive
      ? '[Fotobook] Account Reactivation Notice'
      : '[Fotobook] Account Suspension Notice';

    MailService.sendEmail({ to: updatedUser.email, subject, html: emailHtml });

    logInfo(
      SERVICE_NAME,
      `Successfully toggled status for User ID: ${targetUserId} to: ${isActive} and sent status email`
    );

    return updatedUser;
  },
};
