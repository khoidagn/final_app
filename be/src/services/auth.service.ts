import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../middlewares/error.middleware.js';
import { logError } from '../utils/logging.js';
const generateAccessToken = (userId: number, role: string): string => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_ACCESS_SECRET || 'default_access_secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

const generateRefreshToken = (userId: number): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

export const authService = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new AppError(400, 'This email address is already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const newUser = await prisma.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        passwordHash: passwordHash,
        role: 'user',
      },
    });

    const accessToken = generateAccessToken(newUser.id, newUser.role);
    const refreshToken = generateRefreshToken(newUser.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    };
  },

  login: async (credentials: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });
    if (!user || !user.isActive) {
      throw new AppError(401, 'Account does not exist or has been deactivated');
    }

    const isPasswordMatch = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    );
    if (!isPasswordMatch) {
      throw new AppError(401, 'Incorrect password');
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  },

  refreshSession: async (token: string) => {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || 'default_refresh_secret'
      ) as { id: number };

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user || !user.isActive) {
        throw new AppError(401, 'User no longer exists or is deactivated');
      }

      const newAccessToken = generateAccessToken(user.id, user.role);
      return { accessToken: newAccessToken };
    } catch (error) {
      logError(
        'AuthService',
        'Failed to refresh session: ' + (error as Error).message
      );
      throw new AppError(401, 'Invalid or expired refresh token');
    }
  },
};
