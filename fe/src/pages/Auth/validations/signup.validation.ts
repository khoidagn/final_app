import { SIGNUP_CONSTANTS } from '../constants/signup.constant';

export interface SignUpFieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateSignUpForm(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): SignUpFieldErrors {
  const errors: SignUpFieldErrors = {};

  const firstNameTrimmed = data.firstName.trim();
  const lastNameTrimmed = data.lastName.trim();
  const emailTrimmed = data.email.trim();
  const passwordTrimmed = data.password.trim();
  const confirmPasswordTrimmed = data.confirmPassword.trim();

  if (!firstNameTrimmed) {
    errors.firstName = SIGNUP_CONSTANTS.VALIDATION.FIRST_NAME_REQUIRED;
  }
  if (!lastNameTrimmed) {
    errors.lastName = SIGNUP_CONSTANTS.VALIDATION.LAST_NAME_REQUIRED;
  }

  if (!emailTrimmed) {
    errors.email = SIGNUP_CONSTANTS.VALIDATION.EMAIL_REQUIRED;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      errors.email = SIGNUP_CONSTANTS.VALIDATION.EMAIL_INVALID;
    }
  }

  if (!passwordTrimmed) {
    errors.password = SIGNUP_CONSTANTS.VALIDATION.PASSWORD_REQUIRED;
  } else if (passwordTrimmed.length < 6) {
    errors.password = SIGNUP_CONSTANTS.VALIDATION.PASSWORD_TOO_SHORT;
  }

  if (!confirmPasswordTrimmed) {
    errors.confirmPassword =
      SIGNUP_CONSTANTS.VALIDATION.CONFIRM_PASSWORD_REQUIRED;
  } else if (passwordTrimmed !== confirmPasswordTrimmed) {
    errors.confirmPassword = SIGNUP_CONSTANTS.VALIDATION.PASSWORDS_NOT_MATCH;
  }

  return errors;
}
