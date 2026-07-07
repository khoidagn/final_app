import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../middlewares/error.middleware.js';
import { logError } from '../utils/logging.js';
import { config } from '../config/env.js';
import { Role } from '@prisma/client';

const generateAccessToken = (userId: number, role: Role): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.accessExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign({ id: userId, role }, config.jwt.accessSecret, options);
};

const generateRefreshToken = (userId: number): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign({ id: userId }, config.jwt.refreshSecret, options);
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
        role: Role.USER,
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
