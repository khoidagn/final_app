export const FORGOT_PASSWORD_CONSTANTS = {
  UI: {
    TITLE: 'Forgot Password',
    SUBTITLE:
      'Enter your email address and we will send you a link to reset your password.',
    LABEL_EMAIL: 'Email Address',
    BUTTON_SUBMIT: 'Send Reset Link',
    BUTTON_SENDING: 'Sending...',
    BUTTON_RESEND: 'Resend Email',
    BUTTON_COOLDOWN: (seconds: number) => `Resend in ${seconds}s`,
    TITLE_SENT: 'Check your email',
    DESC_SENT: (email: string) =>
      `We have sent a password reset link to ${email || 'your email'}.`,
    STATUS_QUESTION: "Didn't receive the email?",
    TRY_ANOTHER_EMAIL: 'Try another email address',
    BACK_TO_LOGIN: 'Back to Login',
  },

  PLACEHOLDERS: {
    EMAIL: 'name@example.com',
  },

  VALIDATION: {
    EMAIL_REQUIRED: 'Email address is required.',
  },

  API_RESPONSE: {
    SUCCESS: 'Password reset link sent to your email.',
    FAILED: 'Failed to send reset link. Please try again.',
  },

  COOLDOWN_MESSAGE: (seconds: number) =>
    `Please wait ${seconds} seconds before requesting another email.`,
} as const;
