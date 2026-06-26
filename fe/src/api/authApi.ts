import { apiClient } from './apiClient';
import type { AuthSessionResponse } from '../services/auth.service';

export const authApi = {
  fetchCurrentSession: () => {
    return apiClient.get<AuthSessionResponse>('/auth_session');
  }
};