export const UserRole = {
  GUEST: 'GUEST',
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface AuthUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string | null;
  role: UserRoleType;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

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
