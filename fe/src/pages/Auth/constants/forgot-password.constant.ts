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
    EMAIL_REQUIRED: 'Please enter your email address.',
  },

  API_RESPONSE: {
    SEND_SUCCESS: 'Password reset link has been sent to your email!',
    SEND_FAILED: 'Failed to send password reset email. Please try again.',
  },

  COOLDOWN_MESSAGE: (seconds: number) =>
    `Please wait ${seconds} seconds before requesting another email.`,
} as const;
