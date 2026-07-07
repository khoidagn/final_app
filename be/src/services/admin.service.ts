import { Role } from '@prisma/client';
import prisma from '../config/prisma.js';
import { logInfo, logError } from '../utils/logging.js';
import { AppError } from '../middlewares/error.middleware.js';
import { MailService } from '../utils/mail.js';
import { MailTemplates } from '../utils/mail-templates.js';

const ADMIN_LIMIT = 40;
const SERVICE_NAME = 'AdminService';

export const adminService = {
  getAllPhotosMaster: async (page: number) => {
    logInfo(
      SERVICE_NAME,
      `Master inspection - Fetching ALL photos. Page: ${page}`
    );
    const skip = (page - 1) * ADMIN_LIMIT;
    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        include: { user: { select: { id: true, email: true } }, media: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: ADMIN_LIMIT,
      }),
      prisma.photo.count(),
    ]);
    return {
      photos,
      meta: {
        total,
        page,
        limit: ADMIN_LIMIT,
        totalPages: Math.ceil(total / ADMIN_LIMIT),
      },
    };
  },

  getAllAlbumsMaster: async (page: number) => {
    logInfo(
      SERVICE_NAME,
      `Master inspection - Fetching ALL albums. Page: ${page}`
    );
    const skip = (page - 1) * ADMIN_LIMIT;
    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        include: {
          user: { select: { id: true, email: true } },
          albumMedias: { include: { media: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: ADMIN_LIMIT,
      }),
      prisma.album.count(),
    ]);
    return {
      albums,
      meta: {
        total,
        page,
        limit: ADMIN_LIMIT,
        totalPages: Math.ceil(total / ADMIN_LIMIT),
      },
    };
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

    MailService.sendEmail({
      to: updatedUser.email,
      subject,
      html: emailHtml,
    });

    return updatedUser;
  },
};
