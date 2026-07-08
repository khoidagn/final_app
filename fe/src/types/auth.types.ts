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

export interface RegisterInput {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: unknown;
}

export interface LoginInput {
  email: string;
  password?: string;
  [key: string]: unknown;
}
