import { Request, Response, NextFunction } from 'express';
import { Donation, User } from '../models';
import { sendSuccess } from '../utils/response';
import { AuthenticationError, NotFoundError } from '../utils/errors';

/**
 * Get user's donation history
 */
export async function getDonationHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const donations = await Donation.find({ userId: req.user.userId })
      .populate('donationCenterId', 'name address city')
      .sort({ date: -1 })
      .limit(50);

    // Calculate stats
    const donationsByType: Record<string, number> = {
      sang_total: 0,
      plaquetes: 0,
      plasma: 0,
      'medul·la': 0,
    };

    donations.forEach((donation) => {
      if (donationsByType[donation.donationType] !== undefined) {
        donationsByType[donation.donationType]++;
      }
    });

    const history = {
      donations,
      stats: {
        totalDonations: user.donationCount,
        livesSaved: user.livesSaved,
        totalTokens: user.tokens,
        donationsByType,
        lastDonationDate: donations.length > 0 ? donations[0]?.date : undefined,
        nextEligibleDate: donations.length > 0 ? calculateNextEligibleDate(donations[0]!) : undefined,
      },
    };

    sendSuccess(res, history);
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's analytics data
 */
export async function getAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const donations = await Donation.find({ userId: req.user.userId }).sort({ date: 1 });

    // Group donations by month
    const donationEvolution: Array<{ month: string; count: number }> = [];
    const monthlyTokens: Array<{ month: string; tokens: number }> = [];
    const monthMap = new Map<string, { count: number; tokens: number }>();

    donations.forEach((donation) => {
      const month = donation.date.toISOString().substring(0, 7); // YYYY-MM
      const existing = monthMap.get(month) || { count: 0, tokens: 0 };
      existing.count++;
      existing.tokens += donation.tokensEarned;
      monthMap.set(month, existing);
    });

    // Convert to arrays
    monthMap.forEach((data, month) => {
      donationEvolution.push({ month, count: data.count });
      monthlyTokens.push({ month, tokens: data.tokens });
    });

    // Get user stats
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const analytics = {
      donationEvolution,
      monthlyTokens,
      stats: {
        totalDonations: user.donationCount,
        livesSaved: user.livesSaved,
        totalTokens: user.tokens,
        donationsByType: calculateDonationsByType(donations),
      },
    };

    sendSuccess(res, analytics);
  } catch (error) {
    next(error);
  }
}

/**
 * Get next eligible donation date
 */
export async function getNextEligibleDate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const lastDonation = await Donation.findOne({ userId: req.user.userId }).sort({ date: -1 });

    if (!lastDonation) {
      sendSuccess(res, {
        date: new Date().toISOString(),
        daysUntil: 0,
      });
      return;
    }

    const nextDate = calculateNextEligibleDate(lastDonation);
    const daysUntil = Math.ceil(
      (nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    sendSuccess(res, {
      date: nextDate.toISOString(),
      daysUntil: Math.max(0, daysUntil),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Helper: Calculate next eligible donation date based on donation type
 */
function calculateNextEligibleDate(lastDonation: { donationType: string; date: Date }): Date {
  const waitingPeriods: Record<string, number> = {
    sang_total: 56, // 8 weeks
    plaquetes: 14, // 2 weeks
    plasma: 14, // 2 weeks
    'medul·la': 365, // 1 year
  };

  const days = waitingPeriods[lastDonation.donationType] || 56;
  const nextDate = new Date(lastDonation.date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

/**
 * Helper: Calculate donations by type
 */
function calculateDonationsByType(
  donations: Array<{ donationType: string }>
): Record<string, number> {
  const byType: Record<string, number> = {
    sang_total: 0,
    plaquetes: 0,
    plasma: 0,
    'medul·la': 0,
  };

  donations.forEach((donation) => {
    if (byType[donation.donationType] !== undefined) {
      byType[donation.donationType]++;
    }
  });

  return byType;
}
