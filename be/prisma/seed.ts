import { SharingMode, Role, LikeableType } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Đồng bộ thư viện bcryptjs giống seedAdmin
import prisma from '../src/config/prisma.js';
import { logInfo, logError } from '../src/utils/logging.js'; // Sử dụng bộ logging chuẩn của dự án
const SERVICE_NAME = 'MasterSeed';

// Mật khẩu chung mã hóa cho tất cả tài khoản test để tiện đăng nhập thử nghiệm
const PASSWORD_RAW = 'khoi123';

// Kho ảnh ảo mock từ Unsplash chất lượng cao theo nhiều chủ đề
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
  'https://images.unsplash.com/photo-1472214222541-d510753a4707',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1',
];

async function runMasterSeed() {
  logInfo(
    SERVICE_NAME,
    '🌱 [MASTER SEED]: Bắt đầu tiến trình khởi tạo toàn bộ dữ liệu mẫu hệ thống...'
  );

  try {
    await prisma.user.deleteMany({});

    logInfo(
      SERVICE_NAME,
      '✨ [DỌN DẸP]: Đã xóa sạch dữ liệu cũ trong Database.'
    );

    const hashedPassword = await bcrypt.hash(PASSWORD_RAW, 10);

    // 1. Tạo Tài khoản Admin tối cao & Tài khoản cá nhân mặc định để test
    const adminUser = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'Manager',
        email: 'admin.fotobook@example.com',
        passwordHash: hashedPassword,
        role: Role.ADMIN,
        isActive: true,
        confirmedAt: new Date(),
        avatarUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      },
    });

    const mainUser = await prisma.user.create({
      data: {
        firstName: 'Dang',
        lastName: 'Khoi',
        email: 'khoi.vo2026@example.com',
        passwordHash: hashedPassword,
        role: Role.USER,
        isActive: true,
        confirmedAt: new Date(),
        avatarUrl:
          'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
      },
    });

    // Tạo thêm 30 người dùng ngẫu nhiên khác
    const createdUsers = [adminUser, mainUser];
    for (let i = 1; i <= 30; i++) {
      const user = await prisma.user.create({
        data: {
          firstName: `FiName_${i}`,
          lastName: `LaName_${i}`,
          email: `user.${i}@example.com`,
          passwordHash: hashedPassword,
          role: Role.USER,
          isActive: Math.random() > 0.1,
          confirmedAt: Math.random() > 0.2 ? new Date() : null,
          avatarUrl: `https://i.pravatar.cc/150?img=${i}`,
        },
      });
      createdUsers.push(user);
    }
    logInfo(
      SERVICE_NAME,
      `👤 [USER]: Khởi tạo thành công ${createdUsers.length} tài khoản người dùng.`
    );

    // 2. Tạo số lượng lớn Media và Photos (120 ảnh)
    const createdPhotos = [];
    const sharingModes = [
      SharingMode.PUBLIC,
      SharingMode.PUBLIC,
      SharingMode.PUBLIC,
      SharingMode.PRIVATE,
    ];

    for (let i = 1; i <= 120; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomImageUrl =
        MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
      const mode =
        sharingModes[Math.floor(Math.random() * sharingModes.length)];

      const media = await prisma.media.create({
        data: {
          imageUrl: randomImageUrl,
        },
      });

      const photo = await prisma.photo.create({
        data: {
          title: `Tuyệt tác thiên nhiên số #${i}`,
          description: `Bức ảnh phong cảnh tuyệt đẹp được chụp ngẫu nhiên trong hành trình khám phá hệ thống.`,
          sharingMode: mode,
          userId: randomUser.id,
          mediaId: media.id,
          likesCount: 0,
        },
      });
      createdPhotos.push(photo);
    }
    logInfo(
      SERVICE_NAME,
      `📷 [PHOTO]: Đã tạo thành công ${createdPhotos.length} bức ảnh ảo trên toàn hệ thống.`
    );

    // 3. Tạo 40 Albums
    const createdAlbums = [];
    for (let i = 1; i <= 40; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const mode =
        sharingModes[Math.floor(Math.random() * sharingModes.length)];

      const album = await prisma.album.create({
        data: {
          title: `Bộ sưu tập mùa hè #${i}`,
          description: `Kỷ niệm hành trình thực tập Nus Technology Summer và khoảnh khắc đáng nhớ.`,
          sharingMode: mode,
          userId: randomUser.id,
          likesCount: 0,
        },
      });

      const photoCount = Math.floor(Math.random() * 4) + 3;
      const shuffledPhotos = [...createdPhotos].sort(() => 0.5 - Math.random());

      for (let pos = 0; pos < photoCount; pos++) {
        await prisma.albumMedia.create({
          data: {
            albumId: album.id,
            mediaId: shuffledPhotos[pos].mediaId,
            position: pos,
          },
        });
      }
      createdAlbums.push(album);
    }
    logInfo(
      SERVICE_NAME,
      `📂 [ALBUM]: Đã tạo cấu trúc quan hệ tương quan cho ${createdAlbums.length} Albums.`
    );

    // 4. Tạo tương tác chéo ngẫu nhiên (Likes & Follows)
    logInfo(
      SERVICE_NAME,
      '👥 [FOLLOW]: Đang thiết lập mạng lưới kết nối và follow chéo nhau...'
    );

    for (const user of createdUsers) {
      const potentialTargets = createdUsers.filter((u) => u.id !== user.id);
      const targets = potentialTargets
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      for (const target of targets) {
        // Tạo follow một chiều: user -> target
        await prisma.follow
          .create({
            data: {
              followerId: user.id,
              followingId: target.id,
            },
          })
          .catch(() => {});

        // 🎲 TẠO FOLLOW CHÉO: Xác suất 50% target sẽ follow ngược lại user
        if (Math.random() > 0.5) {
          await prisma.follow
            .create({
              data: {
                followerId: target.id,
                followingId: user.id,
              },
            })
            .catch(() => {});
        }
      }
    }

    // Tạo tương tác Like cho ảnh
    for (const photo of createdPhotos) {
      const likeCount = Math.floor(Math.random() * 11);
      const likers = [...createdUsers]
        .sort(() => 0.5 - Math.random())
        .slice(0, likeCount);

      for (const liker of likers) {
        await prisma.like
          .create({
            data: {
              userId: liker.id,
              likeableType: LikeableType.PHOTO,
              likeableId: photo.id,
            },
          })
          .catch(() => {});
      }

      await prisma.photo.update({
        where: { id: photo.id },
        data: { likesCount: likers.length },
      });
    }

    // 🟢 5. BỔ SUNG QUAN TRỌNG: Đồng bộ đếm và cập nhật ngược lại cache counters trong bảng Users
    logInfo(
      SERVICE_NAME,
      '📊 [COUNTER]: Đang tiến hành đồng bộ bộ đếm followersCount và followingsCount thực tế...'
    );

    for (const user of createdUsers) {
      // Đếm tổng số người mà user này đang ấn theo dõi
      const followingCount = await prisma.follow.count({
        where: { followerId: user.id },
      });

      // Đếm tổng số người đang ấn theo dõi user này
      const followersCount = await prisma.follow.count({
        where: { followingId: user.id },
      });

      // Ghi nhận trực tiếp con số tổng vào record User
      await prisma.user.update({
        where: { id: user.id },
        data: {
          followingsCount: followingCount,
          followersCount: followersCount,
        },
      });
    }

    logInfo(SERVICE_NAME, '--------------------------------------------------');
    logInfo(
      SERVICE_NAME,
      '🎉 [THÀNH CÔNG]: HỆ THỐNG SEED DỮ LIỆU TOÀN CỤC HOÀN THÀNH XUẤT SẮC!'
    );
    logInfo(
      SERVICE_NAME,
      `📧 Tài khoản Admin test: admin.fotobook@example.com`
    );
    logInfo(SERVICE_NAME, `📧 Tài khoản User chính: khoi.vo2026@example.com`);
    logInfo(SERVICE_NAME, `🔑 Mật khẩu chung đăng nhập: ${PASSWORD_RAW}`);
    logInfo(SERVICE_NAME, '--------------------------------------------------');
  } catch (error: any) {
    logError(
      SERVICE_NAME,
      `❌ [THẤT BẠI]: Tiến trình seed dữ liệu bị lỗi nghiêm trọng. Chi tiết: ${error?.message || error}`
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMasterSeed();
