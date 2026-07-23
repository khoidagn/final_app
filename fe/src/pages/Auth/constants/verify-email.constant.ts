export const VERIFY_EMAIL_CONSTANTS = {
  UI: {
    LOADING_TEXT: 'Verifying your email address...',
    TITLE_SUCCESS: 'Email Verified!',
    TITLE_FAILED: 'Verification Failed',
    BUTTON_SUCCESS: 'Go to Login',
    BUTTON_FAILED: 'Back to Signup',
  },
  API_RESPONSE: {
    DEFAULT_SUCCESS:
      'Your email has been successfully verified! You can now log in.',
    DEFAULT_FAILED: 'Invalid or expired verification link. Please try again.',
  },
} as const;
