import { Router } from 'express';
import * as usersController from '../controllers/usersController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * All routes require authentication
 */
router.use(authenticate);

/**
 * GET /api/users/profile
 * Get current user's full profile
 */
router.get('/profile', usersController.getProfile);

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', usersController.updateProfile);

/**
 * PUT /api/users/settings/notifications
 * Update notification settings
 */
router.put('/settings/notifications', usersController.updateNotificationSettings);

/**
 * PUT /api/users/settings/privacy
 * Update privacy settings
 */
router.put('/settings/privacy', usersController.updatePrivacySettings);

export default router;
