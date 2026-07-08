import { Router } from 'express';
import { photoController } from '../controllers/photo.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/discovery_photos', photoController.getDiscoveryPhotos);

router.post(
  '/upload',
  requireAuth,
  uploadSingle.single('photo'),
  photoController.uploadPhoto
);
router.get('/feeds_photos', requireAuth, photoController.getFeedsPhotos);
router.get('/my_photos', requireAuth, photoController.getMyPhotos);
router.get('/user/:userId', requireAuth, photoController.getUserPhotos);
router.put(
  '/:id',
  requireAuth,
  uploadSingle.single('photo'),
  photoController.updatePhoto
);
router.delete('/:id', requireAuth, photoController.deletePhoto);

export default router;
