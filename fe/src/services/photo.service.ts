import { photoApi } from '../api/photo.api';

export const photoService = {
  getDiscoveryPhotos: async (page: number, perPage: number) => {
    const response = await photoApi.getDiscoveryPhotos(page, perPage);
    return response.data;
  },

  getFeedsPhotos: async (page: number, perPage: number) => {
    const response = await photoApi.getFeedsPhotos(page, perPage);
    return response.data;
  },

  getMyPhotos: async () => {
    const response = await photoApi.getMyPhotos();
    return response.data;
  },

  getUserPhotos: async (userId: number) => {
    const response = await photoApi.getUserPhotos(userId);
    return response.data;
  },

  uploadPhoto: async (formData: FormData) => {
    const response = await photoApi.uploadPhoto(formData);
    return response.data;
  },

  updatePhoto: async (id: number, formData: FormData) => {
    const response = await photoApi.updatePhoto(id, formData);
    return response.data;
  },

  deletePhoto: async (id: number) => {
    const response = await photoApi.deletePhoto(id);
    return response.data;
  },

  getPhotoById: async (id: number) => {
    const response = await photoApi.getPhotoDetail(id);
    return response.data;
  },
};
