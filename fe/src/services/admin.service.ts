import { adminApi } from '../api/admin.api';
import type {
  PaginatedData,
  PaginationMeta,
  ApiResponse,
} from '../types/common.type';
import type {
  AdminUpdateUserPayload,
  AdminUserDetail,
  AdminPhotoData,
  AdminAlbumData,
  AdminUserData,
} from '../types/admin.type';

type EndpointDataKey = 'users' | 'photos' | 'albums';

interface EndpointConfig {
  fetcher: (
    page: number,
    limit: number
  ) => Promise<{
    data: ApiResponse<{
      users?: AdminUserData[];
      photos?: AdminPhotoData[];
      albums?: AdminAlbumData[];
      meta?: PaginationMeta;
    }>;
  }>;
  dataKey: EndpointDataKey;
}

const PAGINATED_ENDPOINT_MAP: Record<string, EndpointConfig> = {
  admin_users: { fetcher: adminApi.getUsers, dataKey: 'users' },
  'admin/users': { fetcher: adminApi.getUsers, dataKey: 'users' },
  admin_photos: { fetcher: adminApi.getPhotos, dataKey: 'photos' },
  'admin/photos': { fetcher: adminApi.getPhotos, dataKey: 'photos' },
  admin_albums: { fetcher: adminApi.getAlbums, dataKey: 'albums' },
  'admin/albums': { fetcher: adminApi.getAlbums, dataKey: 'albums' },
};

export const adminService = {
  getPaginatedData: async <T>(
    endpoint: string,
    page: number,
    limit: number
  ): Promise<PaginatedData<T>> => {
    const config = PAGINATED_ENDPOINT_MAP[endpoint];

    if (!config) {
      throw new Error(`Unsupported admin endpoint: ${endpoint}`);
    }

    const response = await config.fetcher(page, limit);
    const resData = response.data?.data;

    const defaultMeta: PaginationMeta = {
      page,
      limit,
      total: 0,
      totalPages: 1,
    };

    const rawItems = resData?.[config.dataKey] ?? [];

    return {
      items: rawItems as T[],
      meta: resData?.meta ? { ...defaultMeta, ...resData.meta } : defaultMeta,
    };
  },

  async getUserById(id: number): Promise<AdminUserDetail> {
    const response = await adminApi.getUserById(id);
    return response.data?.data;
  },

  async getPhotoById(id: number): Promise<AdminPhotoData> {
    const response = await adminApi.getPhotoById(id);
    return response.data?.data;
  },

  async getAlbumById(id: number): Promise<AdminAlbumData> {
    const response = await adminApi.getAlbumById(id);
    return response.data?.data;
  },

  async updatePhoto(id: number, formData: FormData): Promise<void> {
    await adminApi.updatePhoto(id, formData);
  },

  async updateAlbum(id: number, formData: FormData): Promise<void> {
    await adminApi.updateAlbum(id, formData);
  },

  async deletePhoto(id: number): Promise<void> {
    await adminApi.deletePhoto(id);
  },

  async deleteAlbum(id: number): Promise<void> {
    await adminApi.deleteAlbum(id);
  },

  async toggleUserStatus(id: number, isActive: boolean): Promise<void> {
    await adminApi.updateUserStatus(id, isActive);
  },

  async updateUserProfile(
    id: number,
    data: FormData | AdminUpdateUserPayload
  ): Promise<void> {
    await adminApi.updateUserProfile(id, data);
  },

  async deleteUser(id: number): Promise<void> {
    await adminApi.deleteUser(id);
  },
};
