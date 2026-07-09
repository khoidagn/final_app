import { apiClient } from './api.client';
import type {
  AuthUser,
  LoginInput,
  LoginResponse,
  RegisterInput,
  ResetPasswordInput,
} from '../types/auth.types';

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

  getCurrentUser() {
    return apiClient.get<AuthUser>('/auth/me');
  },

  forgotPassword(email: string) {
    return apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword(data: ResetPasswordInput) {
    return apiClient.post('/auth/reset-password', data);
  },
};
