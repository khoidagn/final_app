import { apiClient } from './api.client';
import type {
  AuthUser,
  LoginInput,
  LoginResponse,
  RegisterInput,
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

  login(credentials: LoginInput) {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  logout() {
    return apiClient.post('/auth/logout');
  },

  getCurrentUser() {
    return apiClient.get<AuthUser>('/auth/me');
  },
};
