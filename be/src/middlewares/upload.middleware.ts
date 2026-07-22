import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { AppError } from './error.middleware.js';
import cloudinary from '../config/cloudinary.js';
import { logInfo, logWarning } from '../utils/logging.js';

const MODULE_NAME = 'UploadMiddleware';

/**
 * Configuration for Cloudinary storage engine utilizing multer-storage-cloudinary.
 * Handles the stream directly to Cloudinary folder destinations.
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req: Request, _file: Express.Multer.File) => {
    return {
      folder: 'upload-finalapp',
      allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
      transformation: [{ quality: 'auto:good' }],
    };
  },
});

/**
 * File filter utility to validate incoming multipart request MIME types (Best Practice 5).
 * Strictly filters out unaccepted image formats before uploading to Cloudinary.
 *
 * @param {Request} _req - Express Request context object (unused).
 * @param {Express.Multer.File} file - Object representing the processed file chunk metadata.
 * @param {FileFilterCallback} cb - Multer callback to accept or reject the file stream.
 * @returns {void}
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  logInfo(MODULE_NAME, `Validating file mimetype header: ${file.mimetype}`);

  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ];

  if (allowedMimeTypes.includes(file.mimetype) === true) {
    logInfo(
      MODULE_NAME,
      `File mimetype format verified successfully: ${file.mimetype}`
    );
    cb(null, true);
  } else {
    const errorMsg = `Invalid file type: ${file.mimetype}. Only JPEG, JPG, PNG, and GIF are allowed.`;
    logWarning(
      MODULE_NAME,
      `Mimetype validation violation triggered: ${errorMsg}`
    );
    cb(new AppError(400, errorMsg));
  }
};

export const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadAvatar = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array('images', 25);
