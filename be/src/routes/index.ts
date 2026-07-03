import { Router } from 'express';
import authRoutes from './auth.routes.js';
import photoRoutes from './photo.routes.js';
const rootRouter = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/photos', photoRoutes);
// rootRouter.use('/admin', adminRoutes);

export default rootRouter;
