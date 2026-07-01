import { adminApi } from '../api/adminApi';

export interface PaginatedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

export const adminService = {
  getPaginatedData: async <T>(
    endpoint: string,
    page: number,
    perPage: number
  ): Promise<PaginatedResponse<T>> => {
    const response = await adminApi.fetchPaginatedData<T>(
      endpoint,
      page,
      perPage
    );
    return response.data;
  },
};
