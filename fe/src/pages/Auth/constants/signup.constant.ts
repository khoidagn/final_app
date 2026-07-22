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
    FIRST_NAME: 'Koi',
    LAST_NAME: 'Dawg',
    EMAIL: 'name@example.com',
    PASSWORD: '••••••••',
  },

  VALIDATION: {
    EMAIL_REQUIRED: 'Please enter a valid email address.',
    NAME_REQUIRED: 'Please enter both first name and last name.',
    PASSWORD_REQUIRED: 'Please enter your password.',
    PASSWORDS_NOT_MATCH: 'Passwords do not match. Please verify your password.',
  },
  API_RESPONSE: {
    REGISTER_SUCCESS:
      'Account created successfully! Redirecting for verification...',
    REGISTER_FAILED:
      'Registration failed. Please check your information and try again.',
  },
} as const;
