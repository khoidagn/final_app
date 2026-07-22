import { apiClient } from './api.client';

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  avatarUrl?: string;
}

export const userApi = {
  getMe: () => apiClient.get('/users/me'),

  getUserById: (id: string | number) => apiClient.get(`/users/${id}`),

  updateProfile: (data: FormData) =>
    apiClient.put('/users/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteAccount: () => apiClient.delete('/users/account'),

  getMyFollowers: (page = 1) =>
    apiClient.get('/users/my-followers', { params: { page } }),

  getMyFollowing: (page = 1) =>
    apiClient.get('/users/my-following', { params: { page } }),

  getUserFollowers: (id: string | number, page = 1) =>
    apiClient.get(`/users/${id}/followers`, { params: { page } }),

  getUserFollowing: (id: string | number, page = 1) =>
    apiClient.get(`/users/${id}/following`, { params: { page } }),
};
