import { SharingMode, Role, LikeableType } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Đồng bộ thư viện bcryptjs giống seedAdmin
import prisma from '../src/config/prisma.js';
import { logInfo, logError } from '../src/utils/logging.js'; // Sử dụng bộ logging chuẩn của dự án
const SERVICE_NAME = 'MasterSeed';

// Mật khẩu chung mã hóa cho tất cả tài khoản test để tiện đăng nhập thử nghiệm
const PASSWORD_RAW = 'mysecurepassword123';

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
    // 0. Dọn sạch dữ liệu cũ theo thứ tự ưu tiên ràng buộc (Tránh lỗi Foreign Key)
    await prisma.like.deleteMany({});
    await prisma.follow.deleteMany({});
    await prisma.albumMedia.deleteMany({});
    await prisma.photo.deleteMany({});
    await prisma.album.deleteMany({});
    await prisma.media.deleteMany({});
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
        passwordHash: hashedPassword, // Sửa thành trường passwordHash cho đúng schema của bạn
        role: Role.ADMIN, // Đảm bảo khớp enum Role viết hoa của Prisma
        isActive: true,
        confirmedAt: new Date(), // 🟢 QUAN TRỌNG: Đóng dấu kích hoạt email để đăng nhập được ngay
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
        confirmedAt: new Date(), // Tự động xác thực cho user test chính
        avatarUrl:
          'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
      },
    });

    // Tạo thêm 30 người dùng ngẫu nhiên khác
    const createdUsers = [adminUser, mainUser];
    for (let i = 1; i <= 30; i++) {
      const user = await prisma.user.create({
        data: {
          firstName: `UserFirstName_${i}`,
          lastName: `UserLastName_${i}`,
          email: `user.${i}@example.com`, // Sửa lỗi cú pháp chuỗi ban đầu của bạn
          passwordHash: hashedPassword,
          role: Role.USER,
          isActive: Math.random() > 0.1, // 90% active, 10% bị khóa ngẫu nhiên để admin vào test
          confirmedAt: Math.random() > 0.2 ? new Date() : null, // 80% đã verify email
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
    // Tỷ lệ: 75% ảnh Public, 25% ảnh Private để kiểm tra tính năng Master Inspection của Admin

    for (let i = 1; i <= 120; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomImageUrl =
        MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
      const mode =
        sharingModes[Math.floor(Math.random() * sharingModes.length)];

      // ✅ Sửa đổi: Chỉ truyền trường imageUrl duy nhất khớp với model Media của bạn
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

      // Gom ngẫu nhiên từ 3 đến 6 bức ảnh vào Album này
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
      '💖 [TƯƠNG TÁC]: Đang kết nối mạng lưới tương tác chéo ngẫu nhiên...'
    );

    // Tạo tương tác Follow
    for (const user of createdUsers) {
      const potentialTargets = createdUsers.filter((u) => u.id !== user.id);
      const targets = potentialTargets
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      for (const target of targets) {
        await prisma.follow
          .create({
            data: {
              followerId: user.id,
              followingId: target.id,
            },
          })
          .catch(() => {}); // Chặn crash nếu vô tình trùng Unique Compound Key
      }
    }

    // Tạo tương tác Like cho ảnh
    for (const photo of createdPhotos) {
      const likeCount = Math.floor(Math.random() * 11);
      const likers = [...createdUsers]
        .sort(() => 0.5 - Math.random())
        .slice(0, likeCount);

      for (const liker of likers) {
        // ✅ Sửa đổi: Khớp chuẩn cấu trúc Composite ID [userId, likeableType, likeableId]
        await prisma.like
          .create({
            data: {
              userId: liker.id,
              likeableType: LikeableType.PHOTO, // Chỉ định rõ đây là Like dành cho PHOTO
              likeableId: photo.id, // Gắn ID của bức ảnh vào đây
            },
          })
          .catch(() => {});
      }

      // Cập nhật lại bộ đếm likes_count
      await prisma.photo.update({
        where: { id: photo.id },
        data: { likesCount: likers.length },
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
