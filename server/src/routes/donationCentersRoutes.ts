import { Router } from 'express';
import * as donationCentersController from '../controllers/donationCentersController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * Use optional auth (public endpoints but can be personalized if authenticated)
 */
router.use(optionalAuth);

/**
 * GET /api/donation-centers/nearby
 * Get donation centers near a location
 */
router.get('/nearby', donationCentersController.getNearbyDonationCenters);

/**
 * GET /api/donation-centers
 * Get all donation centers
 */
router.get('/', donationCentersController.getDonationCenters);

/**
 * GET /api/donation-centers/:id
 * Get a specific donation center
 */
router.get('/:id', donationCentersController.getDonationCenter);

export default router;
