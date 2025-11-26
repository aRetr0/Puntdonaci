import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', authController.login);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticate, authController.me);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authenticate, authController.logout);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', authenticate, authController.refreshToken);

export default router;
