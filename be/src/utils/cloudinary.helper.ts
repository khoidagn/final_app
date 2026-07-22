/**
 * Extracts the Cloudinary public_id from an absolute image URL.
 * @param url The image URL formatted as: https://res.cloudinary.com/.../folder-name/photo-123.jpg
 * @param folder The folder name on Cloudinary. Defaults to 'upload-finalapp'.
 * @returns The public_id formatted as: folder-name/photo-123
 */
export const getPublicIdFromUrl = (
  url: string,
  folder = 'upload-finalapp'
): string => {
  if (!url) return '';

  const urlParts = url.split('/');
  const fileNameWithExtension = urlParts[urlParts.length - 1];
  const fileName = fileNameWithExtension.split('.')[0];

  return `${folder}/${fileName}`;
};
