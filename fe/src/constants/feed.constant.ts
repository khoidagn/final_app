export const FEED_CONSTANTS = {
  API_RESPONSE: {
    FETCH_FAILED: 'Failed to load feed items.',
    FOLLOW_AUTH_REQUIRED: 'Please log in to follow users!',
    FOLLOW_FAILED: 'Failed to update follow status. Please try again.',
    LIKE_AUTH_REQUIRED: 'Please log in to like items!',
    LIKE_FAILED: (type: 'photo' | 'album') =>
      `Failed to update like status for ${type}. Please try again.`,
  },
  UI: {
    PHOTOS_TAB: 'Photo',
    ALBUMS_TAB: 'Album',
    YOU_LABEL: 'You',
  },
} as const;
