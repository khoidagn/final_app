export type FeedTabType = 'photo' | 'album';

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isFollowing: boolean;
}









export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


export interface AlbumImageLocal {
  id: string | number;
  file?: File;
  previewUrl: string;
}
