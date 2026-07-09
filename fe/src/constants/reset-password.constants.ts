export const RESET_PASSWORD_CONSTANTS = {
  UI: {
    TITLE: 'Reset Your Password',
    SUBTITLE: 'Please enter your new password below.',
    LABEL_PASSWORD: 'New Password',
    LABEL_CONFIRM: 'Confirm New Password',
    BUTTON_SUBMIT: 'Update Password',
    BUTTON_RESETTING: 'Updating...',
    ERROR_NO_TOKEN:
      'Missing secure token. Please click the link inside your verification email again.',
  },

  PLACEHOLDERS: {
    PASSWORD: '••••••••',
  },

  VALIDATION: {
    TOKEN_INVALID: 'Invalid or expired reset token.',
    PASSWORDS_NOT_MATCH: 'Passwords do not match.',
  },

  API_RESPONSE: {
    RESET_SUCCESS: 'Password reset successfully! Please log in.',
    RESET_FAILED: 'Failed to reset password. Please try again.',
  },
} as const;
