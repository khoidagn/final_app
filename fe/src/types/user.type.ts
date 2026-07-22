export interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
}

export interface UserFollowData {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  photosCount: number;
  albumsCount: number;
  isFollowing: boolean;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  stats?: {
    photosCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export interface UserProfileDetailData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  role: string;
  followingsCount: number;
  followersCount: number;
  isFollowing?: boolean;
  _count?: {
    photos: number;
    albums: number;
  };
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
}

export interface ConnectionUserSummary {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
