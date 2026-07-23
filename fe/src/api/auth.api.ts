import { apiClient } from './api.client';
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  ResetPasswordInput,
} from '../types/auth.type';

export interface UserResponseData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
}

export interface AuthWrappedResponse {
  success: boolean;
  message: string;
  data: UserResponseData;
}

export const authApi = {
  register(data: RegisterInput) {
    return apiClient.post('/auth/register', data);
  },

  verifyEmail(token: string) {
    return apiClient.get('/auth/verify-email', {
      params: { token },
    });
  },

  resendVerification(email: string) {
    return apiClient.post('/auth/resend-verification', { email });
  },

  checkStatus(email: string) {
    return apiClient.get('/auth/check-status', {
      params: { email },
    });
  },

  login(credentials: LoginInput) {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  logout() {
    return apiClient.post('/auth/logout');
  },

  getCurrentUser: () => {
    return apiClient.get('/users/me');
  },

  forgotPassword(email: string) {
    return apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword(data: ResetPasswordInput) {
    return apiClient.post('/auth/reset-password', data);
  },

  refreshToken(refreshToken?: string) {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: {
        accessToken: string;
        refreshToken?: string;
      };
    }>('/auth/refresh', { refreshToken });
  },
};
