import type { ApiResponse } from './common.type';
import type { UserSummary } from './feeds.type';
import type { SharingModeType } from './enum.type';

export interface AlbumMediaItem {
  albumId: number;
  mediaId: number;
  position: number;
  media: {
    id: number;
    imageUrl: string;
  };
}

export interface AlbumData {
  id: number;
  userId: number;
  title: string;
  description: string;
  sharingMode: SharingModeType;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user: UserSummary;
  albumMedias?: AlbumMediaItem[];
  isLiked: boolean;
}

export interface AlbumDetailData {
  id: number;
  title: string;
  description: string;
  sharingMode: SharingModeType;
  albumMedias?: AlbumMediaItem[];
}

export type AlbumDetailResponse = ApiResponse<AlbumDetailData>;
