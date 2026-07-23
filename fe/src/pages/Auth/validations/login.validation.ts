import { LOGIN_CONSTANTS } from '../constants/login.constant';

export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export function validateLoginForm(
  email: string,
  password: string
): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  const emailTrimmed = email.trim();
  const passwordTrimmed = password.trim();

  if (!emailTrimmed) {
    errors.email = LOGIN_CONSTANTS.VALIDATION.EMAIL_REQUIRED;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  if (!passwordTrimmed) {
    errors.password = LOGIN_CONSTANTS.VALIDATION.PASSWORD_REQUIRED;
  }

  return errors;
}
