import { Router } from 'express';
import { searchController } from '../controllers/search.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, searchController.globalSearch);

export default router;
