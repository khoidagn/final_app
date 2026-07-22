import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/me', requireAuth, userController.getMyProfile);
router.put(
  '/profile',
  requireAuth,
  uploadAvatar.single('avatar'),
  userController.updateProfile
);
router.delete('/account', requireAuth, userController.deleteMyAccount);

router.get('/my-followers', requireAuth, userController.getFollowers);
router.get('/my-following', requireAuth, userController.getFollowing);

router.get('/:id', optionalAuth, userController.getUserProfileById);
router.get('/:id/followers', optionalAuth, userController.getFollowers);
router.get('/:id/following', optionalAuth, userController.getFollowing);

export default router;
