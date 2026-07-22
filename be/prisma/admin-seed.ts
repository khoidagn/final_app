import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/prisma.js';
import { logInfo, logError } from '../src/utils/logging.js';

const SERVICE_NAME = 'AdminSeed';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin12345';

async function seedAdmin() {
  logInfo(
    SERVICE_NAME,
    '🛡️ [ADMIN SEED]: Đang khởi chạy tiến trình khởi tạo Quản trị viên...'
  );

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  try {
    const admin = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        role: Role.ADMIN,
        isActive: true,
        confirmedAt: new Date(),
      },
      create: {
        firstName: 'Super',
        lastName: 'Admin',
        email: ADMIN_EMAIL,
        passwordHash: hashedPassword,
        role: Role.ADMIN,
        isActive: true,
        confirmedAt: new Date(),
        avatarUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      },
    });

    logInfo(SERVICE_NAME, '--------------------------------------------------');
    logInfo(
      SERVICE_NAME,
      '✅ [THÀNH CÔNG]: Tài khoản Admin tối cao đã sẵn sàng!'
    );
    logInfo(SERVICE_NAME, `📧 Email: ${admin.email}`);
    logInfo(SERVICE_NAME, `🔑 Password: ${ADMIN_PASSWORD}`);
    logInfo(SERVICE_NAME, `🔰 Quyền hạn: ${admin.role}`);
    logInfo(
      SERVICE_NAME,
      `📅 Xác thực: ${admin.confirmedAt ? 'Đã kích hoạt' : 'Chưa kích hoạt'}`
    );
    logInfo(SERVICE_NAME, '--------------------------------------------------');
  } catch (error: any) {
    logError(
      SERVICE_NAME,
      `❌ [THẤT BẠI]: Không thể khởi tạo tài khoản Admin. Chi tiết: ${error?.message || error}`
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
