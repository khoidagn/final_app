import { type ApiResponse } from './common.type';
import type { UserRoleType } from './enum.type';

export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  role: UserRoleType;
}

export type LoginResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}>;

export type CurrentUserResponse = ApiResponse<AuthUser>;

export interface SessionResponse {
  isLoggedIn: boolean;
  user: AuthUser | null;
}

export interface LoginInput {
  email: string;
  password?: string;
  [key: string]: unknown;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}
