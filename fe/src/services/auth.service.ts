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

    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('role', response.data.data.user.role);
      localStorage.setItem('userId', response.data.data.user.id.toString());
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
    }
  },

  async getCurrentSession(): Promise<SessionResponse> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return { isLoggedIn: false, user: null };
    }
    try {
      const response = await authApi.getCurrentUser();
      return { isLoggedIn: true, user: response.data };
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
    const response = await authApi.refreshToken();
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    return accessToken;
  },
};
