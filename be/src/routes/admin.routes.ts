import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { albumController } from '../controllers/album.controller.js';
import { photoController } from '../controllers/photo.controller.js';
import { requireAuth, authorizeRoles } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';
import {
  uploadMultiple,
  uploadSingle,
} from '../middlewares/upload.middleware.js';
import { Role } from '@prisma/client';

const router = Router();
router.use(requireAuth, requireAdmin);

router.get('/photos', adminController.getPhotos);
router.get('/albums', adminController.getAlbums);
router.get('/users', requireAuth, requireAdmin, adminController.getUsers);

router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id', adminController.patchUserStatus);
router.put(
  '/users/:id',
  requireAuth,
  authorizeRoles(Role.ADMIN),
  uploadSingle.single('avatar'),
  adminController.adminUpdateUser
);
router.delete(
  '/users/:id',
  requireAuth,
  authorizeRoles(Role.ADMIN),
  adminController.adminDeleteUser
);

router.get('/photos/:id', adminController.adminGetPhotoById);
router.put(
  '/photos/:id',
  requireAuth,
  uploadSingle.single('photo'),
  photoController.updatePhoto
);
router.delete(
  '/photos/:id',
  requireAuth,
  authorizeRoles(Role.ADMIN),
  photoController.deletePhoto
);

router.get('/albums/:id', adminController.adminGetAlbumById);
router.put('/albums/:id', uploadMultiple, adminController.adminUpdateAlbum);
router.delete(
  '/albums/:id',
  requireAuth,
  authorizeRoles(Role.ADMIN),
  albumController.deleteAlbum
);

export default router;
