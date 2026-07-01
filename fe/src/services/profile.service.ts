import { profileApi } from '../api/profileApi';

export const profileService = {
  getMyProfile: async () => {
    const response = await profileApi.fetchMyProfile();
    return response.data;
  },

  getPublicProfile: async (userId: string | undefined) => {
    const response = await profileApi.fetchPublicProfile(userId);
    return response.data;
  },

  getProfileContent: async (
    resource: 'photos' | 'albums' | 'followings' | 'followers'
  ) => {
    const response = await profileApi.fetchProfileContent(resource);
    return response.data;
  },

  updateBasicInfo: async (data: {
    first_name: string;
    last_name: string;
    email: string;
  }) => {
    const response = await profileApi.updateBasicInfo(data);
    return response.data;
  },
};
