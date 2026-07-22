import prisma from '../config/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import { logError, logInfo } from '../utils/logging.js';
import { LikeableType } from '@prisma/client';

const SERVICE_NAME = 'InteractionService';

export const interactionService = {
  toggleLike: async (
    likeableId: number,
    likeableType: LikeableType,
    userId: number
  ) => {
    if (likeableType === LikeableType.PHOTO) {
      const photo = await prisma.photo.findUnique({
        where: { id: likeableId },
      });
      if (!photo) throw new AppError(404, 'Photo not found.');
    } else {
      const album = await prisma.album.findUnique({
        where: { id: likeableId },
      });
      if (!album) throw new AppError(404, 'Album not found.');
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_likeableType_likeableId: { userId, likeableType, likeableId },
      },
    });

    return await prisma.$transaction(async (tx) => {
      if (existingLike) {
        await tx.like.delete({
          where: {
            userId_likeableType_likeableId: {
              userId,
              likeableType,
              likeableId,
            },
          },
        });

        if (likeableType === LikeableType.PHOTO) {
          await tx.photo.update({
            where: { id: likeableId },
            data: { likesCount: { decrement: 1 } },
          });
        } else {
          await tx.album.update({
            where: { id: likeableId },
            data: { likesCount: { decrement: 1 } },
          });
        }

        logInfo(
          SERVICE_NAME,
          `User ${userId} unliked ${likeableType} ${likeableId}`
        );
        return { liked: false, message: 'Unliked successfully.' };
      }

      await tx.like.create({
        data: { userId, likeableType, likeableId },
      });

      if (likeableType === LikeableType.PHOTO) {
        await tx.photo.update({
          where: { id: likeableId },
          data: { likesCount: { increment: 1 } },
        });
      } else {
        await tx.album.update({
          where: { id: likeableId },
          data: { likesCount: { increment: 1 } },
        });
      }

      logInfo(
        SERVICE_NAME,
        `User ${userId} liked ${likeableType} ${likeableId}`
      );
      return { liked: true, message: 'Liked successfully.' };
    });
  },

  toggleFollowUser: async (targetUserId: number, followerId: number) => {
    if (targetUserId === followerId) {
      logError(
        SERVICE_NAME,
        `FollowAction - User ${followerId} tried to follow themselves`
      );
      throw new AppError(400, 'You cannot follow yourself.');
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!targetUser) {
      logError(
        SERVICE_NAME,
        `FollowAction - Target user ${targetUserId} not found`
      );
      throw new AppError(404, 'User to follow not found.');
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId: targetUserId },
      },
    });

    return await prisma.$transaction(async (tx) => {
      if (existingFollow) {
        await tx.follow.delete({
          where: {
            followerId_followingId: { followerId, followingId: targetUserId },
          },
        });

        await tx.user.update({
          where: { id: followerId },
          data: { followingsCount: { decrement: 1 } },
        });
        await tx.user.update({
          where: { id: targetUserId },
          data: { followersCount: { decrement: 1 } },
        });

        logInfo(
          SERVICE_NAME,
          `User ${followerId} unfollowed User ${targetUserId}`
        );
        return { followed: false, message: 'Unfollowed successfully.' };
      }

      await tx.follow.create({
        data: { followerId, followingId: targetUserId },
      });

      await tx.user.update({
        where: { id: followerId },
        data: { followingsCount: { increment: 1 } },
      });
      await tx.user.update({
        where: { id: targetUserId },
        data: { followersCount: { increment: 1 } },
      });

      logInfo(SERVICE_NAME, `User ${followerId} followed User ${targetUserId}`);
      return { followed: true, message: 'Followed successfully.' };
    });
  },
};
