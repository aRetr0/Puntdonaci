import { Request, Response, NextFunction } from 'express';
import { Campaign } from '../models';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';

/**
 * Get all campaigns
 */
export async function getCampaigns(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status } = req.query;
    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'active'; // Default to active campaigns
    }

    const campaigns = await Campaign.find(query)
      .sort({ priority: 1, endDate: 1 }) // Sort by priority (urgent first), then by end date
      .limit(20);

    sendSuccess(res, campaigns);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific campaign
 */
export async function getCampaign(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    sendSuccess(res, campaign);
  } catch (error) {
    next(error);
  }
}

/**
 * Get campaigns the user has participated in
 * (For now, this is a placeholder - would need CampaignParticipation model)
 */
export async function getUserCampaigns(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Placeholder: return empty array for now
    // In full implementation, would query CampaignParticipation model
    sendSuccess(res, []);
  } catch (error) {
    next(error);
  }
}
