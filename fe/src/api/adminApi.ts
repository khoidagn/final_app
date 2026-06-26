import { apiClient } from './apiClient';
import type { PaginatedResponse } from '../services/admin.service';

export const adminApi = {
  fetchPaginatedData: <T>(endpoint: string, page: number, perPage: number) => {
    return apiClient.get<PaginatedResponse<T>>(`/${endpoint}`, {
      params: { _page: page, _per_page: perPage }
    });
  }
};