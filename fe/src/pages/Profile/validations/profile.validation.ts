import type { UpdateProfileFormData } from '../../../types/user.type';

export interface ProfileFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  avatar?: string;
}

export function validateProfileForm(
  form: UpdateProfileFormData,
  passwordForm: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  },
  isChangingPassword: boolean
): ProfileFormErrors {
  const errors: ProfileFormErrors = {};

  const trimmedFirstName = form.firstName.trim();
  if (!trimmedFirstName) {
    errors.firstName = 'First name is required.';
  } else if (trimmedFirstName.length > 25) {
    errors.firstName = 'First name must not exceed 25 characters.';
  }

  const trimmedLastName = form.lastName.trim();
  if (!trimmedLastName) {
    errors.lastName = 'Last name is required.';
  } else if (trimmedLastName.length > 25) {
    errors.lastName = 'Last name must not exceed 25 characters.';
  }

  const trimmedEmail = form.email.trim();
  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (trimmedEmail.length > 255) {
    errors.email = 'Email must not exceed 255 characters.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  if (isChangingPassword) {
    const {
      currentPassword = '',
      newPassword = '',
      confirmPassword = '',
    } = passwordForm;

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required.';
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (newPassword.length > 64) {
      errors.newPassword = 'Password must not exceed 64 characters.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword && confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }

  return errors;
}
