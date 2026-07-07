import request from 'supertest';
import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import prisma from '../config/prisma.js';

jest.mock('../config/prisma.js', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn(), create: jest.fn() },
  },
}));

const app = express();
app.use(express.json());
app.post('/api/v1/auth/register', authController.register);
app.post('/api/v1/auth/login', authController.login);

describe('=== AUTH MODULE TESTS ===', () => {
  it('Should fail registration if email already exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'khoi.vo2026@example.com' });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Dang',
        lastName: 'Khoi',
        email: 'khoi.vo2026@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(400);
  });

  it('Should login successfully and return access token', async () => {
    // Giả lập tìm thấy user hợp lệ
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'khoi.vo2026@example.com',
      password: '$2b$10$hashedpassword', // Giả lập bcrypt hash
      isActive: true,
      role: 'user'
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'khoi.vo2026@example.com', password: 'mysecurepassword123' });

    // Tùy thuộc vào logic controller của bạn, check status 200 hoặc trả về token
    expect(res.status).toBe(200);
  });
});