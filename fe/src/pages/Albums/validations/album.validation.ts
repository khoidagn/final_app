import type { AlbumImageLocal } from '../../../types/feeds.type';

export interface AlbumFormErrors {
  title?: string;
  description?: string;
  images?: string;
}

export function validateAlbumForm(
  formData: {
    title: string;
    description: string;
    albumImages: AlbumImageLocal[];
  },
  isEdit: boolean = false
): AlbumFormErrors {
  const errors: AlbumFormErrors = {};

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

  if (!isEdit && formData.albumImages.length === 0) {
    errors.images = 'At least one image is required for the album.';
  } else if (formData.albumImages.length > 25) {
    errors.images = 'An album can contain at most 25 images.';
  }

  return errors;
}
