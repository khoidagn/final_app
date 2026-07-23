import { type SharingModeType } from '../../../types/enum.type';

export interface PhotoFormErrors {
  title?: string;
  description?: string;
  sharingMode?: string;
  file?: string;
}

export function validatePhotoForm(
  formData: {
    title: string;
    description: string;
    sharingMode: SharingModeType;
    file: File | null | undefined;
    previewSrc?: string;
  },
  isEdit: boolean = false
): PhotoFormErrors {
  const errors: PhotoFormErrors = {};

  const trimmedTitle = formData.title.trim();
  if (!trimmedTitle) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length > 140) {
    errors.title = 'Title must not exceed 140 characters.';
  }

  const trimmedDesc = formData.description.trim();
  if (!trimmedDesc) {
    errors.description = 'Description is required.';
  } else if (trimmedDesc.length > 300) {
    errors.description = 'Description must not exceed 300 characters.';
  }

  if (!isEdit && !formData.file) {
    errors.file = 'Attached image is required.';
  } else if (formData.file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (!allowedTypes.includes(formData.file.type)) {
      errors.file = 'Accepted formats are jpeg, png, and gif.';
    } else if (formData.file.size > maxSizeInBytes) {
      errors.file = 'Maximum image size is 5MB.';
    }
  }

  const hasImage =
    Boolean(formData.file) || Boolean(formData.previewSrc?.trim());
  if (!hasImage) {
    errors.file = 'Photo image is required. Please upload an image.';
  }

  return errors;
}
