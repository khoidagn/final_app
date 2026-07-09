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
    EMAIL_REQUIRED: 'Email address is required.',
    NAME_REQUIRED: 'Please fill in both your first name and last name.',
    PASSWORD_REQUIRED: 'Password is required.',
    PASSWORDS_NOT_MATCH: 'Passwords do not match. Please verify your typing.',
  },

  API_RESPONSE: {
    REGISTER_SUCCESS: 'Registration successful! Verification email sent.',
    REGISTER_FAILED: 'Registration failed. This email might already be taken.',
  },
} as const;
