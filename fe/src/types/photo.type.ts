import type {  UserSummary } from './feeds.type';
import type { SharingModeType } from './enum.type';
export interface PhotoData {
  id: number;
  userId: number;
  mediaId: number;
  title: string;
  description: string;
  sharingMode: SharingModeType;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user: UserSummary;
  media?: {
    id: number;
    imageUrl: string;
  };
  isLiked?: boolean;
}

export interface PhotoFormData {
  title: string;
  sharingMode: SharingModeType; 
  description: string;
  previewSrc: string;
  imageFile?: File | null; 
}