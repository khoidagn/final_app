export const VERIFY_WAITING_CONSTANTS = {
  UI: {
    TITLE_PENDING: 'Verify Your Email',
    TITLE_SUCCESS: 'Verification Successful!',
    DESC_PENDING: (email: string) =>
      `We have sent a verification link to ${email}. Please check your inbox to activate your account.`,
    DESC_SUCCESS:
      'Your account has been successfully verified! Preparing to redirect you to the login page.',
    STATUS_WAITING: 'Waiting for verification...',
    STATUS_QUESTION: "Didn't receive the email?",
    BUTTON_RESEND: 'Resend Email',
    BUTTON_SENDING: 'Sending...',
    BUTTON_COOLDOWN: (seconds: number) => `Resend in ${seconds}s`,
  },

  API_RESPONSE: {
    VERIFY_SUCCESS: 'Account verified successfully! Redirecting to login...',
    RESEND_SUCCESS: 'A new verification link has been sent to your email.',
    RESEND_FAILED:
      'Failed to resend verification link. Please try again later.',
  },
  COOLDOWN_MESSAGE: (seconds: number) =>
    `Please wait ${seconds} seconds before requesting another email.`,
} as const;
