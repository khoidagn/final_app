import type { ApiResponse, PaginatedData } from './common.type';
import { type SharingModeType, type UserRoleType } from './enum.type';
export type AdminWrappedResponse<T> = ApiResponse<PaginatedData<T>>;
export type AdminUserDetailWrappedResponse = ApiResponse<AdminUserDetail>;
export type AdminPhotoDetailWrappedResponse = ApiResponse<AdminPhotoData>;
export type AdminAlbumDetailWrappedResponse = ApiResponse<AdminAlbumData>;

export interface AdminPhotoData {
  id: number;
  title: string;
  sharingMode: SharingModeType;
  userId: number;
  createdAt?: string;
  media?: { id: number; imageUrl: string };
  description?: string;
  likesCount?: number;
  user?: { id: number; email: string };
}

export interface AlbumMediaRelation {
  albumId: number;
  mediaId: number;
  position: number;
  media: { id: number; imageUrl: string };
}

export interface AdminAlbumData {
  id: number;
  title: string;
  description: string;
  sharingMode: SharingModeType;
  createdAt?: string;
  userId: number;
  albumMedias?: AlbumMediaRelation[];
}

export interface AdminUserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  role: UserRoleType;
  lastLogin?: string;
}

export interface AdminUserDetail {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: UserRoleType;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
}
