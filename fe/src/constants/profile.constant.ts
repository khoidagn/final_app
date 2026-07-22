export const PROFILE_CONSTANTS = {
  LIMITS: {
    MAX_AVATAR_SIZE_BYTES: 2 * 1024 * 1024, // 2MB
    MAX_AVATAR_SIZE_MB: 2,
    MIN_PASSWORD_LENGTH: 6,
  },
  VALIDATION: {
    CURRENT_PASSWORD_REQUIRED:
      'Please enter your current password for verification.',
    NEW_PASSWORD_REQUIRED: 'Please enter a new password.',
    NEW_PASSWORD_TOO_SHORT: (min: number) =>
      `New password must be at least ${min} characters long.`,
    PASSWORDS_NOT_MATCH: 'Confirm password does not match.',
    FILE_TOO_LARGE: (maxMb: number) =>
      `Avatar image must not exceed ${maxMb}MB.`,
    INCORRECT_DELETE_CONFIRM: 'Incorrect confirmation text. Deletion canceled.',
  },
  API_RESPONSE: {
    FETCH_PROFILE_FAILED: 'Failed to load profile details.',
    UPDATE_SUCCESS: 'Profile updated successfully!',
    UPDATE_FAILED: 'Failed to update profile. Please try again.',
    DELETE_SUCCESS: 'Your account has been successfully deleted. Goodbye!',
    DELETE_FAILED: 'Failed to delete account. Please try again later.',
  },
  CONFIRM: {
    DELETE_ACCOUNT_WARNING:
      'WARNING: Are you sure you want to permanently delete this account? All your photos and albums will be completely removed from the system!',
    DELETE_ACCOUNT_PROMPT:
      'Please type "DELETE" in the box below to confirm account deletion:',
  },
  UI: {
    DANGER_ZONE_TEXT:
      'No longer need your Fotobook account? You can choose to permanently close your account here.',
    DELETE_BUTTON: 'Permanently Delete Account',
    DELETING_BUTTON: 'Deleting Account...',
  },
} as const;
