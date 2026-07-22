import { albumApi } from '../api/album.api';

export const albumService = {
  getDiscoveryAlbums: async (page: number, perPage: number) => {
    const response = await albumApi.getDiscoveryAlbums(page, perPage);
    return response.data;
  },

  getFeedsAlbums: async (page: number, perPage: number) => {
    const response = await albumApi.getFeedsAlbums(page, perPage);
    return response.data;
  },

  getMyAlbums: async () => {
    const response = await albumApi.getMyAlbums();
    return response.data;
  },

  getUserAlbums: async (userId: number) => {
    const response = await albumApi.getUserAlbums(userId);
    return response.data;
  },

  uploadAlbum: async (formData: FormData) => {
    const response = await albumApi.uploadAlbum(formData);
    return response.data;
  },

  updateAlbum: async (id: number, formData: FormData) => {
    const response = await albumApi.updateAlbum(id, formData);
    return response.data;
  },

  deleteAlbum: async (id: number) => {
    const response = await albumApi.deleteAlbum(id);
    return response.data;
  },

  getAlbumById: async (id: number) => {
    const response = await albumApi.getAlbumDetail(id);
    return response.data;
  },
};
