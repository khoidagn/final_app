export const ADMIN_CONSTANTS = {
  LIMITS: {
    MAX_AVATAR_SIZE_BYTES: 2 * 1024 * 1024, // 2MB
    MAX_AVATAR_SIZE_MB: 2,
  },
  VALIDATION: {
    FILE_TOO_LARGE: (maxMb: number) =>
      `Avatar file size must not exceed ${maxMb}MB.`,
  },
  API_RESPONSE: {
    FETCH_USER_FAILED:
      'Failed to load user details or you lack Administrator privileges.',
    UPDATE_USER_SUCCESS: 'User profile updated successfully by Admin!',
    UPDATE_USER_FAILED: 'Failed to update user. Please check your input.',
    DELETE_USER_SUCCESS: 'User deleted successfully!',
    DELETE_USER_FAILED: 'Failed to delete user. Please try again.',
    TOGGLE_STATUS_SUCCESS: 'User status updated successfully!',
    TOGGLE_STATUS_FAILED: 'Failed to update user status.',
    DELETE_PHOTO_SUCCESS: 'Photo deleted successfully!',
    DELETE_PHOTO_FAILED: 'Failed to delete photo.',
    DELETE_ALBUM_SUCCESS: 'Album and associated media deleted successfully!',
    DELETE_ALBUM_FAILED: 'Failed to delete album.',
    FETCH_PAGINATED_FAILED: (endpoint: string) =>
      `Failed to fetch batch data from endpoint: ${endpoint}`,
  },
  CONFIRM: {
    DELETE_ALBUM: (title: string) =>
      `Are you sure you want to delete album "${title}"? This will clean up all associated image files on Cloudinary!`,
    DELETE_PHOTO:
      'Are you sure you want to permanently delete this photo? It will be removed globally!',
    DELETE_USER: (email: string) =>
      `Are you sure you want to permanently delete user "${email}"? An email notification will be sent to them.`,
    TOGGLE_USER_STATUS: (action: string) =>
      `Are you sure you want to ${action} this user account?`,
  },
} as const;
