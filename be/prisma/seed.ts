import 'dotenv/config';
import prisma from '../src/config/prisma.js';
import { LikeableType } from '@prisma/client';

async function main() {
  console.log('Start seeding...');

  // 1. Tạo Users
  const user1 = await prisma.user.create({
    data: {
      firstName: 'Nguyen',
      lastName: 'Khoi',
      email: 'khoi@example.com',
      passwordHash: '123',
    },
  });
  const user2 = await prisma.user.create({
    data: {
      firstName: 'Tran',
      lastName: 'An',
      email: 'an@example.com',
      passwordHash: '123',
    },
  });

  // 2. Tạo Media & Photo
  const media1 = await prisma.media.create({
    data: { imageUrl: 'https://picsum.photos/200' },
  });
  const photo1 = await prisma.photo.create({
    data: {
      userId: user1.id,
      mediaId: media1.id,
      title: 'Sunset',
      description: 'Beach view',
    },
  });

  // 3. Tạo Album
  const album1 = await prisma.album.create({
    data: {
      userId: user1.id,
      title: 'Summer 2026',
      description: 'My best photos',
    },
  });

  // 4. Liên kết Album - Media
  const media2 = await prisma.media.create({
    data: { imageUrl: 'https://picsum.photos/300' },
  });
  await prisma.albumMedia.create({
    data: { albumId: album1.id, mediaId: media2.id, position: 1 },
  });

  // 5. Tương tác (Like & Follow)
  await prisma.like.create({
    data: {
      userId: user2.id,
      likeableType: LikeableType.PHOTO,
      likeableId: photo1.id,
    },
  });
  await prisma.follow.create({
    data: { followerId: user2.id, followingId: user1.id },
  });

  console.log('Seeding finished successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
