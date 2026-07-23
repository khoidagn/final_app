import { apiClient } from './api.client';

export const photoApi = {
  getDiscoveryPhotos: (page: number, perPage: number) =>
    apiClient.get('/photos/discovery_photos', {
      params: { page, per_page: perPage },
    }),

  getFeedsPhotos: (page: number, perPage: number) =>
    apiClient.get('/photos/feeds_photos', {
      params: { page, per_page: perPage },
    }),

  getMyPhotos: () => apiClient.get('/photos/my_photos'),

  getUserPhotos: (userId: number) => apiClient.get(`/photos/user/${userId}`),

  uploadPhoto: (formData: FormData) =>
    apiClient.post('/photos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }),

  updatePhoto: (id: number, formData: FormData) =>
    apiClient.put(`/photos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deletePhoto: (id: number) => apiClient.delete(`/photos/${id}`),

  getPhotoDetail: (id: number) => apiClient.get(`/photos/${id}`),
};
