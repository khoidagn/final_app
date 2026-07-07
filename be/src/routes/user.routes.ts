import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.put('/profile', requireAuth, userController.updateMyProfile);
router.delete('/account', requireAuth, userController.deleteMyAccount);

// Xem danh sách follower/following của CHÍNH MÌNH
router.get('/my-followers', requireAuth, userController.getFollowers);
router.get('/my-following', requireAuth, userController.getFollowing);

// Xem danh sách follower/following của MỘT USER BẤT KỲ qua ID
router.get('/:id/followers', requireAuth, userController.getFollowers);
router.get('/:id/following', requireAuth, userController.getFollowing);

export default router;