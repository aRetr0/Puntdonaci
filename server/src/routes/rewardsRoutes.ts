import { Router } from 'express';
import * as rewardsController from '../controllers/rewardsController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * POST /api/rewards/redeem
 * Redeem a reward (requires auth)
 */
router.post('/redeem', authenticate, rewardsController.redeemReward);

/**
 * GET /api/rewards/user
 * Get user's reward transactions (requires auth)
 */
router.get('/user', authenticate, rewardsController.getUserRewards);

/**
 * GET /api/rewards/transactions/:id
 * Get a specific reward transaction (requires auth)
 */
router.get('/transactions/:id', authenticate, rewardsController.getRewardTransaction);

/**
 * PATCH /api/rewards/transactions/:id/cancel
 * Cancel a reward transaction (requires auth)
 */
router.patch('/transactions/:id/cancel', authenticate, rewardsController.cancelRewardTransaction);

/**
 * Use optional auth for public endpoints
 */
router.use(optionalAuth);

/**
 * GET /api/rewards
 * Get all rewards
 */
router.get('/', rewardsController.getRewards);

/**
 * GET /api/rewards/:id
 * Get a specific reward
 */
router.get('/:id', rewardsController.getReward);

export default router;
