import { userApi } from '../api/user.api';

export const userService = {
  getMe: async () => {
    const response = await userApi.getMe();
    return response.data;
  },

  getUserById: async (id: string | number) => {
    const response = await userApi.getUserById(id);
    return response.data;
  },

  updateProfile: async (data: FormData) => {
    const response = await userApi.updateProfile(data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await userApi.deleteAccount();
    return response.data;
  },

  getMyFollowers: async (page = 1) => {
    const response = await userApi.getMyFollowers(page);
    return response.data;
  },

  getMyFollowing: async (page = 1) => {
    const response = await userApi.getMyFollowing(page);
    return response.data;
  },

  getUserFollowers: async (id: string | number, page = 1) => {
    const response = await userApi.getUserFollowers(id, page);
    return response.data;
  },

  getUserFollowing: async (id: string | number, page = 1) => {
    const response = await userApi.getUserFollowing(id, page);
    return response.data;
  },
};
