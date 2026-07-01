export interface Author {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  is_following: boolean;
}

export interface PhotoData {
  id: number;
  title: string;
  description: string;
  image_url: string;
  likes_count: number;
  created_at: string;
  author: Author;
}

export interface AlbumData {
  id: number;
  title: string;
  description: string;
  likes_count: number;
  created_at: string;
  images: string[];
  author: Author;
}

export type FeedTabType = 'photo' | 'album';

export interface PaginatedFeedResponse<T> {
  data: T[];
  hasMore: boolean;
}
