import { apiClient } from './api.client';

export const albumApi = {
  getDiscoveryAlbums: (page: number, perPage: number) =>
    apiClient.get('/albums/discovery_albums', {
      params: { page, per_page: perPage },
    }),

  getFeedsAlbums: (page: number, perPage: number) =>
    apiClient.get('/albums/feeds_albums', {
      params: { page, per_page: perPage },
    }),

  getMyAlbums: () => apiClient.get('/albums/my_albums'),

  getUserAlbums: (userId: number) => apiClient.get(`/albums/user/${userId}`),

  uploadAlbum: (formData: FormData) =>
    apiClient.post('/albums/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }),
    
  updateAlbum: (id: number, formData: FormData) =>
    apiClient.put(`/albums/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAlbumDetail: (id: number) => apiClient.get(`/albums/${id}`),

  deleteAlbum: (id: number) => apiClient.delete(`/albums/${id}`),
};
