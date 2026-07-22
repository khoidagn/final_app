import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import { MailService } from '../utils/mail.js';
import { logError, logInfo, logWarning } from '../utils/logging.js';
import { getPublicIdFromUrl } from '../utils/cloudinary.helper.js';
import cloudinary from '../config/cloudinary.js';

const SERVICE_NAME = 'UserService';

const CountRecord = (userRecord: any) => {
  if (!userRecord) return null;
  return {
    id: userRecord.id,
    firstName: userRecord.firstName,
    lastName: userRecord.lastName,
    avatarUrl: userRecord.avatarUrl,
    photosCount: userRecord._count?.photos || 0,
    albumsCount: userRecord._count?.albums || 0,
  };
};

export const userService = {
  getUserProfile: async (targetUserId: number, currentUserId?: number) => {
    logInfo(
      SERVICE_NAME,
      `Fetching user profile details for Target User ID: ${targetUserId} requested by User ID: ${currentUserId || 'Guest'}`
    );

    const userProfile = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarUrl: true,
        role: true,
        _count: {
          select: {
            photos: true,
            albums: true,
            followers: true, 
            followings: true, 
          },
        },
      },
    });

    if (!userProfile) {
      logError(
        SERVICE_NAME,
        `GetUserProfile failed - Profile not found: ${targetUserId}`
      );
      throw new AppError(404, 'User profile not found.');
    }

    let isFollowing = false;

    if (currentUserId && currentUserId !== targetUserId) {
      const followRecord = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      });
      isFollowing = !!followRecord;
    }

    return {
      id: userProfile.id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      avatarUrl: userProfile.avatarUrl,
      role: userProfile.role,
      isFollowing,
      _count: {
        photos: userProfile._count.photos,
        albums: userProfile._count.albums,
        followers: userProfile._count.followers, 
        following: userProfile._count.followings, 
      },
    };
  },

  updateProfile: async (
    targetUserId: number,
    currentUserId: number,
    currentUserRole: Role,
    updateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      oldPassword?: string;
      password?: string;
      avatarUrl?: string;
    }
  ) => {
    logInfo(
      SERVICE_NAME,
      `Updating profile for Target User ID: ${targetUserId} requested by User ID: ${currentUserId} (Role: ${currentUserRole})`
    );

    if (targetUserId !== currentUserId && currentUserRole !== Role.ADMIN) {
      logError(
        SERVICE_NAME,
        `UpdateProfile Forbidden - User ${currentUserId} role ${currentUserRole} unauthorized for target ${targetUserId}`
      );
      throw new AppError(
        403,
        'You do not have permission to update this profile.'
      );
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      logError(
        SERVICE_NAME,
        `UpdateProfile failed - User not found: ${targetUserId}`
      );
      throw new AppError(404, 'User not found.');
    }

    const dataToUpdate: any = {};
    if (updateData.firstName) dataToUpdate.firstName = updateData.firstName;
    if (updateData.lastName) dataToUpdate.lastName = updateData.lastName;

    if (updateData.avatarUrl) {
      if (user.avatarUrl) {
        const oldPublicId = getPublicIdFromUrl(user.avatarUrl, 'avatars');
        if (oldPublicId) {
          try {
            logInfo(
              SERVICE_NAME,
              `Attempting to delete old avatar with public_id: ${oldPublicId}`
            );
            await cloudinary.uploader.destroy(oldPublicId);
            logInfo(
              SERVICE_NAME,
              `Successfully destroyed old avatar on Cloudinary: ${oldPublicId}`
            );
          } catch (cloudError: any) {
            logError(
              SERVICE_NAME,
              `Failed to delete old avatar on Cloudinary: ${cloudError?.message || cloudError}`
            );
          }
        }
      }
      dataToUpdate.avatarUrl = updateData.avatarUrl;
    }

    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email },
      });
      if (emailExists) {
        logWarning(
          SERVICE_NAME,
          `UpdateProfile rejected - Email already in use: ${updateData.email}`
        );
        throw new AppError(400, 'Email is already in use.');
      }
      dataToUpdate.email = updateData.email;
    }

    if (updateData.password) {
      if (currentUserRole !== Role.ADMIN) {
        if (!updateData.oldPassword) {
          logWarning(
            SERVICE_NAME,
            `UpdateProfile password change rejected - Missing current password`
          );
          throw new AppError(
            400,
            'Current password is required to change to a new password.'
          );
        }

        const isMatch = await bcrypt.compare(
          updateData.oldPassword,
          user.passwordHash
        );
        if (!isMatch) {
          logWarning(
            SERVICE_NAME,
            `UpdateProfile password change rejected - Incorrect current password`
          );
          throw new AppError(400, 'Incorrect current password.');
        }
      }

      dataToUpdate.passwordHash = await bcrypt.hash(updateData.password, 10);
    }

    logInfo(
      SERVICE_NAME,
      `Executing database profile update transaction for User ID: ${targetUserId}`
    );
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
    logInfo(
      SERVICE_NAME,
      `DeleteAccount requested for Target User ID: ${targetUserId} by User ID: ${currentUserId}`
    );

    if (targetUserId !== currentUserId && currentUserRole !== Role.ADMIN) {
      logError(
        SERVICE_NAME,
        `DeleteAccount Forbidden - User ${currentUserId} role ${currentUserRole} unauthorized for target ${targetUserId}`
      );
      throw new AppError(
        403,
        'You do not have permission to delete this account.'
      );
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      logError(
        SERVICE_NAME,
        `DeleteAccount failed - User not found: ${targetUserId}`
      );
      throw new AppError(404, 'User not found.');
    }

    await prisma.user.delete({ where: { id: targetUserId } });
    logInfo(
      SERVICE_NAME,
      `Successfully deleted User account record for User ID: ${targetUserId}`
    );

    try {
      await MailService.sendEmail({
        to: user.email,
        subject: '[Fotobook] Account Closure Notification',
        html: `<p>Hello ${user.firstName},</p><p>Your Fotobook account has been permanently removed from our system.</p>`,
      });
      logInfo(
        SERVICE_NAME,
        `Account closure notification email dispatched to: ${user.email}`
      );
    } catch (mailError) {
      logError(
        SERVICE_NAME,
        `Failed to send account closure email notice to ${user.email}. Detail: ${mailError}`
      );
    }

    return { success: true };
  },

  getFollowers: async (
    targetUserId: number,
    currentUserId?: number,
    page = 1,
    limit = 20
  ) => {
    logInfo(
      SERVICE_NAME,
      `Fetching followers for Target User ID: ${targetUserId} requested by User ID: ${currentUserId}`
    );
    const skip = (page - 1) * limit;

    const userExists = await prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!userExists) {
      logError(
        SERVICE_NAME,
        `GetFollowers failed - Target user not found: ${targetUserId}`
      );
      throw new AppError(404, 'User not found.');
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: targetUserId },
      skip,
      take: limit,
      include: {
        follower: {
          include: {
            _count: {
              select: {
                photos: { where: { sharingMode: 'PUBLIC' } },
                albums: { where: { sharingMode: 'PUBLIC' } },
              },
            },
          },
        },
      },
    });

    const listFollowers = followers.map((f) => f.follower);

    if (currentUserId && listFollowers.length > 0) {
      const followerIds = listFollowers.map((u) => u.id);

      const activeFollows = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: followerIds },
        },
        select: { followingId: true },
      });

      const activeFollowSet = new Set(activeFollows.map((f) => f.followingId));

      return listFollowers.map((u) => ({
        ...CountRecord(u),
        isFollowing: u.id === currentUserId ? false : activeFollowSet.has(u.id),
      }));
    }

    return listFollowers.map((u) => ({
      ...CountRecord(u),
      isFollowing: false,
    }));
  },

  getFollowing: async (
    targetUserId: number,
    currentUserId?: number,
    page = 1,
    limit = 20
  ) => {
    logInfo(
      SERVICE_NAME,
      `Fetching followings for Target User ID: ${targetUserId} requested by User ID: ${currentUserId}`
    );
    const skip = (page - 1) * limit;

    const userExists = await prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!userExists) {
      logError(
        SERVICE_NAME,
        `GetFollowing failed - Target user not found: ${targetUserId}`
      );
      throw new AppError(404, 'User not found.');
    }

    const following = await prisma.follow.findMany({
      where: { followerId: targetUserId },
      skip,
      take: limit,
      include: {
        following: {
          include: {
            _count: {
              select: {
                photos: { where: { sharingMode: 'PUBLIC' } },
                albums: { where: { sharingMode: 'PUBLIC' } },
              },
            },
          },
        },
      },
    });

    const listFollowing = following.map((f) => f.following);

    if (currentUserId && listFollowing.length > 0) {
      const followingIds = listFollowing.map((u) => u.id);

      const activeFollows = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: followingIds },
        },
        select: { followingId: true },
      });

      const activeFollowSet = new Set(activeFollows.map((f) => f.followingId));

      return listFollowing.map((u) => ({
        ...CountRecord(u),
        isFollowing: u.id === currentUserId ? false : activeFollowSet.has(u.id),
      }));
    }

    return listFollowing.map((u) => ({
      ...CountRecord(u),
      isFollowing: false,
    }));
  },
};
