import { FORGOT_PASSWORD_CONSTANTS } from '../constants/forgot-password.constant';

export interface ForgotPasswordErrors {
  email?: string;
}

export function validateForgotPasswordForm(
  email: string
): ForgotPasswordErrors {
  const errors: ForgotPasswordErrors = {};
  const emailTrimmed = email.trim();

  if (!emailTrimmed) {
    errors.email = FORGOT_PASSWORD_CONSTANTS.VALIDATION.EMAIL_REQUIRED;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  return errors;
}
