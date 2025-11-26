import { Router } from 'express';
import * as campaignsController from '../controllers/campaignsController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * GET /api/campaigns/user
 * Get campaigns the user has participated in (requires auth)
 */
router.get('/user', authenticate, campaignsController.getUserCampaigns);

/**
 * Use optional auth for public endpoints
 */
router.use(optionalAuth);

/**
 * GET /api/campaigns
 * Get all campaigns
 */
router.get('/', campaignsController.getCampaigns);

/**
 * GET /api/campaigns/:id
 * Get a specific campaign
 */
router.get('/:id', campaignsController.getCampaign);

export default router;
