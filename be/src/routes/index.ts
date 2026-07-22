import { Router } from 'express';
import authRoutes from './auth.routes.js';
import photoRoutes from './photo.routes.js';
import albumRoutes from './album.routes.js';
import interactionRoutes from './interaction.routes.js';
import adminRoutes from './admin.routes.js';
import userRoutes from './user.routes.js';
import searchRoutes from './search.routes.js';

const rootRouter = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/photos', photoRoutes);
rootRouter.use('/albums', albumRoutes);
rootRouter.use('/interactions', interactionRoutes);
rootRouter.use('/admin', adminRoutes);
rootRouter.use('/users', userRoutes);
rootRouter.use('/search', searchRoutes);

export default rootRouter;
