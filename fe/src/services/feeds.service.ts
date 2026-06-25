const BASE_URL = 'http://localhost:5000';

export interface PaginatedFeedResponse<T> {
  data: T[];
  hasMore: boolean;
}

export const feedsService = {
  getPhotos: async (page: number, perPage: number): Promise<PaginatedFeedResponse<any>> => {
    const response = await fetch(`${BASE_URL}/feeds_photos?_page=${page}&_per_page=${perPage}`);
    if (!response.ok) throw new Error('Không thể tải danh sách ảnh từ Server');
    
    const resData = await response.json();
    return {
      data: resData.data || [],
      hasMore: page < resData.pages 
    };
  },

  getAlbums: async (page: number, perPage: number): Promise<PaginatedFeedResponse<any>> => {
    const response = await fetch(`${BASE_URL}/feeds_albums?_page=${page}&_per_page=${perPage}`);
    if (!response.ok) throw new Error('Không thể tải danh sách album từ Server');
    
    const resData = await response.json();
    return {
      data: resData.data || [],
      hasMore: page < resData.pages
    };
  }
};