import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { AppError } from './error.middleware.js';
import cloudinary from '../config/cloudinary.js';

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
    cb(
      new AppError(
        400,
        'Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.'
      )
    );
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // < 5MB
  },
});
