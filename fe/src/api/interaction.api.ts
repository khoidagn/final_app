import { apiClient } from './api.client';

export const interactionApi = {
  toggleFollowUser: (userId: number) =>
    apiClient.post(`/interactions/users/${userId}/follow`),

  toggleLikePhoto: (photoId: number) =>
    apiClient.post(`/interactions/photos/${photoId}/like`),

  toggleLikeAlbum: (albumId: number) =>
    apiClient.post(`/interactions/albums/${albumId}/like`),
};