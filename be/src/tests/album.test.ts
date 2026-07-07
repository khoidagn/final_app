import request from 'supertest';
import express from 'express';
import { albumController } from '../controllers/album.controller.js';
import prisma from '../config/prisma.js';

jest.mock('../config/prisma.js', () => ({
  __esModule: true,
  default: {
    album: { findUnique: jest.fn(), delete: jest.fn() },
    albumMedia: { deleteMany: jest.fn() },
  },
}));

const app = express();
app.delete('/api/v1/albums/:id', (req: any, res: any, next: any) => { req.user = { id: 1 }; next(); }, albumController.deleteAlbum);

describe('=== ALBUM CASCADE DELETE TESTS ===', () => {
  it('Should block user if they try to delete someone else album', async () => {
    (prisma.album.findUnique as jest.Mock).mockResolvedValue({ id: 1, userId: 999 }); // Khác ID người dùng đăng nhập (=1)

    const res = await request(app).delete('/api/v1/albums/1');
    expect(res.status).toBe(403);
  });
});