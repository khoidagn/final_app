export const ALBUM_CONSTANTS = {
  LIMITS: {
    MAX_IMAGES: 25,
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
    MAX_FILE_SIZE_MB: 5,
  },
  VALIDATION: {
    TITLE_REQUIRED: 'Album title is required.',
    DESCRIPTION_REQUIRED: 'Album description is required.',
    AT_LEAST_ONE_IMAGE: 'Please select at least 1 image for your new album.',
    MAX_IMAGES_EXCEEDED: (max: number) =>
      `An album can contain a maximum of ${max} images.`,
    FILE_TOO_LARGE: (maxMb: number) =>
      `Each image file must not exceed ${maxMb}MB.`,
  },
  API_RESPONSE: {
    FETCH_FAILED: 'Failed to load album details.',
    CREATE_SUCCESS: 'Album created successfully!',
    CREATE_FAILED: 'Failed to create album. Please try again.',
    UPDATE_SUCCESS: 'Album updated successfully!',
    UPDATE_FAILED: 'Failed to update album. Please try again.',
    DELETE_SUCCESS: 'Album deleted successfully!',
    DELETE_FAILED: 'Failed to delete album.',
  },
  CONFIRM: {
    DELETE_USER:
      'Are you sure you want to permanently delete this album and all its associated photos?',
    DELETE_ADMIN:
      'Are you sure you want to remove this album from the system as Administrator?',
  },
  UI: {
    EMPTY_ALBUM: 'This album currently has no photos.',
    CLOSE: 'Close',
  },
} as const;
