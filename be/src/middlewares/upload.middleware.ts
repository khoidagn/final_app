import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { AppError } from './error.middleware.js';
import cloudinary from '../config/cloudinary.js';
import { logError } from '../utils/logging.js';

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

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const errorMsg = `Invalid file type: ${file.mimetype}. Only JPEG, JPG, PNG, and GIF are allowed.`;
    logError('UploadMiddleware', errorMsg);
    cb(new AppError(400, errorMsg));
  }
};

export const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array('images', 25);
