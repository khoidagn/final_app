export const AUTH_MESSAGES = {
  VALIDATION: {
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
    PASSWORD_REQUIRED: 'Please enter your password.',
    EMAIL_REQUIRED: 'Please enter your email.',
    BOTH_REQUIRED: 'Please enter both email and password.',
  },
  API_ERROR: {
    LOGIN_FAILED: 'Invalid email or password. Please try again.',
    EMAIL_TAKEN: 'This email is already registered.',
    SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
    UNAUTHORIZED: 'Your session has expired. Please log in again.',
  },
  SUCCESS: {
    LOGIN: 'Welcome back! Login successful.',
    REGISTER: 'Registration successful! Please check your email to verify.',
    LOGOUT: 'Logged out successfully.',
  },
} as const;
