import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/me', requireAuth, userController.getMyProfile);
router.put('/profile', requireAuth, userController.updateMyProfile);
router.delete('/account', requireAuth, userController.deleteMyAccount);

router.get('/my-followers', requireAuth, userController.getFollowers);
router.get('/my-following', requireAuth, userController.getFollowing);

router.get('/:id', requireAuth, userController.getUserProfileById);
router.get('/:id/followers', requireAuth, userController.getFollowers);
router.get('/:id/following', requireAuth, userController.getFollowing);

export default router;
