import type { ApiResponse } from './common.type';
import type { PhotoData } from './photo.type';
import type { AlbumData } from './album.type';

export interface SearchResultData {
  photos: PhotoData[];
  albums: AlbumData[];
}

export type SearchResponse = ApiResponse<SearchResultData>;
