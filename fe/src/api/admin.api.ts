import { apiClient } from './api.client';
import type {
  AdminPhotoData,
  AdminAlbumData,
  AdminUserData,
  AdminUpdateUserPayload,
  AdminWrappedResponse,
  AdminUserDetailWrappedResponse,
  AdminPhotoDetailWrappedResponse,
  AdminAlbumDetailWrappedResponse,
} from '../types/admin.type';

export const adminApi = {
  getPhotos: (page: number, limit: number) => {
    return apiClient.get<AdminWrappedResponse<AdminPhotoData>>(
      '/admin/photos',
      {
        params: { page, limit },
      }
    );
  },

  updatePhoto: (id: number, formData: FormData) => {
    return apiClient.put(`/admin/photos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deletePhoto: (id: number) => {
    return apiClient.delete(`/admin/photos/${id}`);
  },

  getAlbums: (page: number, limit: number) => {
    return apiClient.get<AdminWrappedResponse<AdminAlbumData>>(
      '/admin/albums',
      {
        params: { page, limit },
      }
    );
  },

  updateAlbum: (id: number, formData: FormData) => {
    return apiClient.put(`/admin/albums/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteAlbum: (id: number) => {
    return apiClient.delete(`/admin/albums/${id}`);
  },

  getUsers: (page: number, limit: number) => {
    return apiClient.get<AdminWrappedResponse<AdminUserData>>('/admin/users', {
      params: { page, limit },
    });
  },
  getPhotoById: (id: number) => {
    return apiClient.get<AdminPhotoDetailWrappedResponse>(
      `/admin/photos/${id}`
    );
  },
  getAlbumById: (id: number) => {
    return apiClient.get<AdminAlbumDetailWrappedResponse>(
      `/admin/albums/${id}`
    );
  },
  getUserById: (id: number) => {
    return apiClient.get<AdminUserDetailWrappedResponse>(`/admin/users/${id}`);
  },

  updateUserStatus: (id: number, isActive: boolean) => {
    return apiClient.patch(`/admin/users/${id}`, { isActive });
  },

  updateUserProfile: (id: number, data: FormData | AdminUpdateUserPayload) => {
    return apiClient.put(`/admin/users/${id}`, data, {
      headers:
        data instanceof FormData
          ? { 'Content-Type': 'multipart/form-data' }
          : undefined,
    });
  },

  deleteUser: (id: number) => {
    return apiClient.delete(`/admin/users/${id}`);
  },
};
