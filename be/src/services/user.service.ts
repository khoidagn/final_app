import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import { MailService } from '../utils/mail.js';
import { logError } from '../utils/logging.js';

const SERVICE_NAME = 'UserService';

export const userService = {
  getUserProfile: async (targetUserId: number) => {
    const userProfile = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: true,
        followingsCount: true,
        followersCount: true,
        _count: {
          select: {
            photos: true,
            albums: true,
          },
        },
      },
    });

    if (!userProfile) {
      throw new AppError(404, 'User profile not found.');
    }

    return userProfile;
  },

  updateProfile: async (
    targetUserId: number,
    currentUserId: number,
    currentUserRole: Role,
    updateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      avatarUrl?: string;
    }
  ) => {
    if (targetUserId !== currentUserId && currentUserRole !== Role.ADMIN) {
      throw new AppError(
        403,
        'You do not have permission to update this profile.'
      );
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new AppError(404, 'User not found.');

    const dataToUpdate: any = {};
    if (updateData.firstName) dataToUpdate.firstName = updateData.firstName;
    if (updateData.lastName) dataToUpdate.lastName = updateData.lastName;
    if (updateData.avatarUrl) dataToUpdate.avatarUrl = updateData.avatarUrl;

    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email },
      });
      if (emailExists) throw new AppError(400, 'Email is already in use.');
      dataToUpdate.email = updateData.email;
    }

    if (updateData.password) {
      dataToUpdate.passwordHash = await bcrypt.hash(updateData.password, 10);
    }

    return await prisma.user.update({
      where: { id: targetUserId },
      data: dataToUpdate,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });
  },

  deleteAccount: async (
    targetUserId: number,
    currentUserId: number,
    currentUserRole: Role
  ) => {
    if (targetUserId !== currentUserId && currentUserRole !== Role.ADMIN) {
      throw new AppError(
        403,
        'You do not have permission to delete this account.'
      );
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new AppError(404, 'User not found.');

    await prisma.user.delete({ where: { id: targetUserId } });

    try {
      await MailService.sendEmail({
        to: user.email,
        subject: '[Fotobook] Account Closure Notification',
        html: `<p>Hello ${user.firstName},</p><p>Your Fotobook account has been permanently removed from our system.</p>`,
      });
    } catch (mailError) {
      logError(
        SERVICE_NAME,
        `Failed to send account closure email notice to ${user.email}. Detail: ${mailError}`
      );
    }

    return { success: true };
  },

  getFollowers: async (targetUserId: number, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const userExists = await prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!userExists) throw new AppError(404, 'User not found.');

    const followers = await prisma.follow.findMany({
      where: { followingId: targetUserId }, 
      skip,
      take: limit,
      include: {
        follower: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return followers.map((f) => f.follower);
  },

  getFollowing: async (targetUserId: number, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const userExists = await prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!userExists) throw new AppError(404, 'User not found.');

    const following = await prisma.follow.findMany({
      where: { followerId: targetUserId }, 
      skip,
      take: limit,
      include: {
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return following.map((f) => f.following);
  },
};
