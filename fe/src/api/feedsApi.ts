import { apiClient } from './apiClient';

export const feedsApi = {
  fetchPhotos: (page: number, perPage: number) => {
    return apiClient.get('/feeds_photos', {
      params: { _page: page, _per_page: perPage },
    });
  },

  fetchAlbums: (page: number, perPage: number) => {
    return apiClient.get('/feeds_albums', {
      params: { _page: page, _per_page: perPage },
    });
  },
};
