import { feedsApi } from '../api/feedsApi';
import type {
  PhotoData,
  AlbumData,
  PaginatedFeedResponse,
} from '../types/feeds';

export const feedsService = {
  getPhotos: async (
    page: number,
    perPage: number
  ): Promise<PaginatedFeedResponse<PhotoData>> => {
    const response = await feedsApi.fetchPhotos(page, perPage);
    const resData = response.data;
    return {
      data: resData.data || [],
      hasMore: page < resData.pages,
    };
  },

  getAlbums: async (
    page: number,
    perPage: number
  ): Promise<PaginatedFeedResponse<AlbumData>> => {
    const response = await feedsApi.fetchAlbums(page, perPage);
    const resData = response.data;
    return {
      data: resData.data || [],
      hasMore: page < resData.pages,
    };
  },
};
