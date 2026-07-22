export const PHOTO_CONSTANTS = {
  LIMITS: {
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
    MAX_FILE_SIZE_MB: 5,
  },
  VALIDATION: {
    TITLE_REQUIRED: 'Photo title is required.',
    DESCRIPTION_REQUIRED: 'Photo description is required.',
    IMAGE_REQUIRED: 'Please select an image to upload.',
    FILE_TOO_LARGE: (maxMb: number) =>
      `Image file size must not exceed ${maxMb}MB.`,
  },
  API_RESPONSE: {
    FETCH_FAILED: 'Failed to load photo details.',
    UPLOAD_SUCCESS: 'Photo uploaded successfully!',
    UPLOAD_FAILED: 'Failed to upload photo. Please try again.',
    UPDATE_SUCCESS: 'Photo updated successfully!',
    UPDATE_FAILED: 'Failed to update photo. Please try again.',
    DELETE_SUCCESS: 'Photo deleted successfully!',
    DELETE_FAILED: 'Failed to delete photo.',
  },
  CONFIRM: {
    DELETE_USER: 'Are you sure you want to permanently delete this photo?',
    DELETE_ADMIN:
      'Are you sure you want to remove this photo from the system as Administrator?',
  },
} as const;