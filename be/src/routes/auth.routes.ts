import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import { requireAuth, authorizeRoles } from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getMe);

router.get(
  '/admin-dashboard',
  requireAuth,
  authorizeRoles('admin'),
  (req, res) => {
    res
      .status(200)
      .json({ status: 'success', message: 'Welcome to the Admin Kingdom!' });
  }
);

export default router;
