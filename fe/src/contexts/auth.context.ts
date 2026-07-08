import { createContext } from 'react';
import type { AuthUser, LoginResponse } from '../types/auth.types';

export interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: Record<string, unknown>) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
