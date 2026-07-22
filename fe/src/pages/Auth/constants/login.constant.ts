export const LOGIN_CONSTANTS = {
  UI: {
    TITLE: 'Fotobook Login',
    LABEL_EMAIL: 'Email Address',
    LABEL_PASSWORD: 'Password',
    BUTTON_SUBMIT: 'Login',
    BUTTON_LOADING: 'Loading...',
    LINK_FORGOT_PASSWORD: 'Forgot password?',
    FOOTER_PROMPT: "Don't have an account?",
    LINK_SIGN_UP: 'Sign up',
  },

  PLACEHOLDERS: {
    EMAIL: 'name@example.com',
    PASSWORD: '••••••••',
  },

  VALIDATION: {
    BOTH_REQUIRED: 'Please enter both your email address and password.',
    EMAIL_REQUIRED: 'Email address is required.',
    PASSWORD_REQUIRED: 'Password is required.',
  },

  API_RESPONSE: {
    LOGIN_FAILED: 'Invalid email address or password. Please try again.',
    SERVER_ERROR: 'The server is not responding. Please try again later.',
  },
} as const;
