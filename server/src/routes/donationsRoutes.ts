import { Router } from 'express';
import * as donationsController from '../controllers/donationsController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * All routes require authentication
 */
router.use(authenticate);

/**
 * GET /api/donations/history
 * Get user's donation history
 */
router.get('/history', donationsController.getDonationHistory);

/**
 * GET /api/donations/analytics
 * Get user's analytics data
 */
router.get('/analytics', donationsController.getAnalytics);

/**
 * GET /api/donations/next-eligible
 * Get next eligible donation date
 */
router.get('/next-eligible', donationsController.getNextEligibleDate);

export default router;
