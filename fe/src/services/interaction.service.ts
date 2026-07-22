import { interactionApi } from '../api/interaction.api';

export const interactionService = {
  toggleFollowUser: async (userId: number) => {
    const response = await interactionApi.toggleFollowUser(userId);
    return response.data;
  },

  toggleLikePhoto: async (photoId: number) => {
    const response = await interactionApi.toggleLikePhoto(photoId);
    return response.data;
  },

  toggleLikeAlbum: async (albumId: number) => {
    const response = await interactionApi.toggleLikeAlbum(albumId);
    return response.data;
  },
};
