import { Router } from 'express';
import { interactionController } from '../controllers/interaction.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();
router.post('/albums/:id/like', requireAuth, interactionController.likeAlbum);
router.post('/photos/:id/like', requireAuth, interactionController.likePhoto);
router.post('/users/:id/follow', requireAuth, interactionController.followUser);
export default router;
