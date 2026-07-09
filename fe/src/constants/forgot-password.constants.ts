export const FORGOT_PASSWORD_CONSTANTS = {
  UI: {
    TITLE: 'Forgot Password',
    SUBTITLE:
      'Enter your email address and we will send you a link to reset your password.',
    LABEL_EMAIL: 'Email Address',
    BUTTON_SUBMIT: 'Send Reset Link',
    BUTTON_SENDING: 'Sending...',
    BUTTON_COOLDOWN: (seconds: number) => `Resend in ${seconds}s`,
    BACK_TO_LOGIN: 'Back to Login',
  },

  PLACEHOLDERS: {
    EMAIL: 'name@example.com',
  },

  VALIDATION: {
    EMAIL_REQUIRED: 'Email address is required.',
  },

  API_RESPONSE: {
    SEND_SUCCESS:
      'A password reset link has been sent to your email address. Please check your inbox.',
    SEND_FAILED: 'Failed to send reset link. Please try again.',
  },
} as const;
