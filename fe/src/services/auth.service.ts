import { authApi } from '../api/authApi';

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: 'guest' | 'user' | 'admin';
}

export interface AuthSessionResponse {
  isLoggedIn: boolean;
  user: AuthUser | null;
}

export const authService = {
  getCurrentSession: async (): Promise<AuthSessionResponse> => {
    const response = await authApi.fetchCurrentSession();
    return response.data;
  },
};
