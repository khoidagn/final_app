import { authApi } from '../api/auth.api';
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  SessionResponse,
  ResetPasswordInput,
} from '../types/auth.type';

export const authService = {
  async register(data: RegisterInput): Promise<unknown> {
    const response = await authApi.register(data);
    return response.data;
  },

  async verifyEmail(token: string): Promise<unknown> {
    const response = await authApi.verifyEmail(token);
    return response.data;
  },

  async resendVerification(email: string): Promise<unknown> {
    const response = await authApi.resendVerification(email);
    return response.data;
  },

  async checkVerificationStatus(email: string): Promise<boolean> {
    try {
      const response = await authApi.checkStatus(email);
      return response.data?.data?.isConfirmed || false;
    } catch (error) {
      console.error('Error checking verification status:', error);
      return false;
    }
  },

  async login(credentials: LoginInput): Promise<LoginResponse> {
    const response = await authApi.login(credentials);

    const data = response.data?.data;

    if (data?.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken)
        localStorage.setItem('refreshToken', data.refreshToken);
      if (data.user?.role) localStorage.setItem('role', data.user.role);
      if (data.user?.id)
        localStorage.setItem('userId', data.user.id.toString());
    }
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch {
      //
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
    }
  },

  async getCurrentSession(): Promise<SessionResponse> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return { isLoggedIn: false, user: null };
    }
    try {
      const response = await authApi.getCurrentUser();
      return { isLoggedIn: true, user: response.data?.data || response.data };
    } catch {
      return { isLoggedIn: false, user: null };
    }
  },

  async forgotPassword(email: string): Promise<unknown> {
    const response = await authApi.forgotPassword(email);
    return response.data;
  },

  async resetPassword(data: ResetPasswordInput): Promise<unknown> {
    const response = await authApi.resetPassword(data);
    return response.data;
  },

  async refreshSessionTokens(): Promise<string> {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await authApi.refreshToken(storedRefreshToken);
    const data = response.data?.data;

    const accessToken = data?.accessToken;
    const refreshToken = data?.refreshToken;

    if (!accessToken) {
      throw new Error('Failed to refresh access token');
    }

    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    return accessToken;
  },
};
