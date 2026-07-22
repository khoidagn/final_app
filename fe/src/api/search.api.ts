import { apiClient } from './api.client';
import type { SearchResponse } from '../types/search.type';

export const searchApi = {
  globalSearch: (keyword: string) =>
    apiClient.get<SearchResponse>('/search', {
      params: { q: keyword },
    }),
};
