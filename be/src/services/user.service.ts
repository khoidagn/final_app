import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import { MailService } from '../utils/mail.js'; // Giả định helper gửi mail của bạn

export const userService = {
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
    // Kiểm tra quyền: Nếu không phải Admin và cũng không phải chính mình -> Chặn ngay
    if (targetUserId !== currentUserId && currentUserRole !== Role.ADMIN) {
      throw new AppError(
        403,
        'You do not have permission to update this profile.'
      );
    }

    // Tìm xem user có tồn tại không
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new AppError(404, 'User not found.');

    const dataToUpdate: any = {};
    if (updateData.firstName) dataToUpdate.firstName = updateData.firstName;
    if (updateData.lastName) dataToUpdate.lastName = updateData.lastName;
    if (updateData.avatarUrl) dataToUpdate.avatarUrl = updateData.avatarUrl;

    // Nếu thay đổi email, check trùng
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email },
      });
      if (emailExists) throw new AppError(400, 'Email is already in use.');
      dataToUpdate.email = updateData.email;
    }

    // Nếu đổi password, tiến hành băm mật khẩu
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

    // Thực hiện xóa (Nếu có ràng buộc khóa ngoại với Photo/Album, hãy đảm bảo bạn dùng onDelete: Cascade trong Prisma)
    await prisma.user.delete({ where: { id: targetUserId } });

    // Gửi email thông báo gỡ bỏ tài khoản
    try {
      await MailService.sendEmail({
        to: user.email,
        subject: '[Fotobook] Account Closure Notification',
        html: `<p>Hello ${user.firstName},</p><p>Your Fotobook account has been permanently removed from our system.</p>`,
      });
    } catch (mailError) {
      // Không để lỗi gửi mail làm crash luồng xóa dữ liệu chính
      console.error('Failed to send deletion email notice:', mailError);
    }

    return { success: true };
  },

  getFollowers: async (targetUserId: number, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    // Check user tồn tại
    const userExists = await prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!userExists) throw new AppError(404, 'User not found.');

    // Truy vấn bảng trung gian Follow (Giả định schema đặt tên quan hệ là followers/following)
    const followers = await prisma.follow.findMany({
      where: { followingId: targetUserId }, // Những bản ghi mà targetUserId được theo dõi
      skip,
      take: limit,
      include: {
        follower: {
          // Lấy thông tin của người ấn nút theo dõi
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
      where: { followerId: targetUserId }, // Những bản ghi mà targetUserId đi theo dõi người khác
      skip,
      take: limit,
      include: {
        following: {
          // Lấy thông tin của người bị theo dõi
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
