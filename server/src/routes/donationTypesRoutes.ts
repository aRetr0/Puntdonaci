import { Router } from 'express';
import * as donationCentersController from '../controllers/donationCentersController';

const router = Router();

/**
 * GET /api/donation-types
 * Get information about all donation types
 */
router.get('/', donationCentersController.getDonationTypes);

export default router;
