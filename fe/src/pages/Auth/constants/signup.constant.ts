export const SIGNUP_CONSTANTS = {
  UI: {
    TITLE: 'Fotobook Sign Up',
    LABEL_FIRST_NAME: 'First Name',
    LABEL_LAST_NAME: 'Last Name',
    LABEL_EMAIL: 'Email Address',
    LABEL_PASSWORD: 'Password',
    LABEL_CONFIRM_PASSWORD: 'Confirm Password',
    BUTTON_SUBMIT: 'Sign Up',
    BUTTON_LOADING: 'Signing Up...',
    FOOTER_PROMPT: 'Already have an account?',
    LINK_SIGN_IN: 'Sign in',
  },

  PLACEHOLDERS: {
    FIRST_NAME: 'John',
    LAST_NAME: 'Doe',
    EMAIL: 'name@example.com',
    PASSWORD: '••••••••',
  },

  VALIDATION: {
    FIRST_NAME_REQUIRED: 'First name is required.',
    LAST_NAME_REQUIRED: 'Last name is required.',
    EMAIL_REQUIRED: 'Email address is required.',
    EMAIL_INVALID: 'Please enter a valid email address.',
    EMAIL_EXISTS: 'This email address is already registered.',
    PASSWORD_REQUIRED: 'Password is required.',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters.',
    CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password.',
    PASSWORDS_NOT_MATCH: 'Passwords do not match.',
  },

  API_RESPONSE: {
    REGISTER_SUCCESS: 'Registration successful! Please check your email.',
    REGISTER_FAILED:
      'Registration failed. Please check your information and try again.',
  },
} as const;
