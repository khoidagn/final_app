/**
 * Extracts the Cloudinary public_id from an absolute image URL.
 * @param url The image URL formatted as: https://res.cloudinary.com/.../upload-finalapp/photo-123.jpg
 * @returns The public_id formatted as: upload-finalapp/photo-123
 */
export const getPublicIdFromUrl = (url: string): string => {
  if (!url) return '';

  const urlParts = url.split('/');
  const fileNameWithExtension = urlParts[urlParts.length - 1];
  const fileName = fileNameWithExtension.split('.')[0];

  return `upload-finalapp/${fileName}`;
};
