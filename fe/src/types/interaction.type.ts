import type { ApiResponse } from './common.type';

export type LikeResponse = ApiResponse<{
  liked: boolean;
  message: string;
}>;

export type FollowResponse = ApiResponse<{
  followed: boolean;
  message: string;
}>;
