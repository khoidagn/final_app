import { Router } from 'express';
import { albumController } from '../controllers/album.controller.js';
import { uploadMultiple } from '../middlewares/upload.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';
const router = Router();

router.get(
  '/discovery_albums',
  optionalAuth,
  albumController.getDiscoveryAlbums
);
router.get('/feeds_albums', requireAuth, albumController.getFeedsAlbums);
router.get('/my_albums', requireAuth, albumController.getMyAlbums);
router.post(
  '/upload',
  requireAuth,
  uploadMultiple,
  albumController.createAlbum
);

router.get('/user/:userId', optionalAuth, albumController.getUserAlbums);
router.get('/:id', requireAuth, albumController.getAlbumById);
router.put('/:id', requireAuth, uploadMultiple, albumController.updateAlbum);
router.delete('/:id', requireAuth, albumController.deleteAlbum);

export default router;
