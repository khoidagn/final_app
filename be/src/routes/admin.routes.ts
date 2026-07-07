import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { albumController } from '../controllers/album.controller.js';
import { photoController } from '../controllers/photo.controller.js';
import { requireAuth, authorizeRoles } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';
import { Role } from '@prisma/client';
const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/photos', adminController.getPhotos);
router.get('/albums', adminController.getAlbums);
router.patch('/users/:id', adminController.patchUserStatus);
router.delete(
  '/albums/:id',
  requireAuth,
  authorizeRoles(Role.ADMIN),
  albumController.deleteAlbum
);
router.delete(
  '/photos/:id',
  requireAuth,
  authorizeRoles(Role.ADMIN),
  photoController.deletePhoto
);

export default router;
