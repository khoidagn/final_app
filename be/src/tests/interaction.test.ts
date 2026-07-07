import request from 'supertest';
import express from 'express';
import { interactionController } from '../controllers/interaction.controller.js';
import prisma from '../config/prisma.js';

jest.mock('../config/prisma.js', () => ({
  __esModule: true,
  default: {
    like: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
    photo: { update: jest.fn() },
  },
}));

const app = express();
app.use(express.json());
const mockAuth = (req: any, res: any, next: any) => { req.user = { id: 1 }; next(); };
app.post('/api/v1/interactions/photos/:id/like', mockAuth, interactionController.likePhoto);

describe('=== INTERACTION TOGGLE LIKE TESTS ===', () => {
  it('Should create a like entry if user has not liked the photo yet', async () => {
    (prisma.like.findUnique as jest.Mock).mockResolvedValue(null); // Chưa từng like

    const res = await request(app).post('/api/v1/interactions/photos/5/like');
    expect(res.status).toBe(200);
  });
});