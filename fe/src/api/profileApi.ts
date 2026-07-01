import { apiClient } from './apiClient';

export const profileApi = {
  fetchMyProfile: () => apiClient.get('/my_profile'),

  fetchPublicProfile: (userID: string | undefined) =>
    apiClient.get('/public_profile_user', { params: { userId: userID } }),

  fetchProfileContent: (
    resource: 'photos' | 'albums' | 'followings' | 'followers'
  ) => apiClient.get(`/profile_${resource}`),

  updateBasicInfo: (data: {
    first_name: string;
    last_name: string;
    email: string;
  }) => apiClient.patch('/my_profile', data),
};
