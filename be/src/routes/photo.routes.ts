import { Router } from 'express';
import { photoController } from '../controllers/photo.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/discovery_photos', photoController.getDiscoveryPhotos);

router.post(
  '/upload',
  requireAuth,
  upload.single('photo'),
  photoController.uploadPhoto
);
router.get('/feeds_photos', requireAuth, photoController.getFeedsPhotos);
router.get('/my_photos', requireAuth, photoController.getMyPhotos);
router.put(
  '/:id',
  requireAuth,
  upload.single('photo'),
  photoController.updatePhoto
);
router.delete('/:id', requireAuth, photoController.deletePhoto);

export default router;
