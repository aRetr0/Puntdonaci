import { Request, Response, NextFunction } from 'express';
import { User, Donation } from '../models';
import { sendSuccess } from '../utils/response';
import { AuthenticationError, NotFoundError } from '../utils/errors';

/**
 * Get user profile with full details
 */
export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Get user's donation history
    const donations = await Donation.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(10)
      .populate('donationCenterId', 'name');

    // Mock achievements for now (would be calculated based on actual data)
    const achievements = [
      {
        id: '1',
        name: 'Primera donació',
        description: 'Has fet la teva primera donació',
        icon: 'droplet',
        unlockedAt: user.donationCount > 0 ? user.createdAt.toISOString() : undefined,
        isLocked: user.donationCount === 0,
      },
      {
        id: '2',
        name: '5 donacions',
        description: 'Has completat 5 donacions',
        icon: 'award',
        unlockedAt: user.donationCount >= 5 ? new Date().toISOString() : undefined,
        isLocked: user.donationCount < 5,
      },
      {
        id: '3',
        name: 'Salvavides',
        description: 'Has salvat 10 vides',
        icon: 'heart',
        unlockedAt: user.livesSaved >= 10 ? new Date().toISOString() : undefined,
        isLocked: user.livesSaved < 10,
      },
      {
        id: '4',
        name: 'Donant regular',
        description: 'Has donat durant 3 mesos consecutius',
        icon: 'calendar',
        unlockedAt: undefined,
        isLocked: true,
      },
    ];

    const profile = {
      ...user.toJSON(),
      donationHistory: donations,
      achievements,
    };

    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const { name, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { notifications: req.body },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    sendSuccess(res, user.notifications);
  } catch (error) {
    next(error);
  }
}

/**
 * Update privacy settings
 */
export async function updatePrivacySettings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { privacy: req.body },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    sendSuccess(res, user.privacy);
  } catch (error) {
    next(error);
  }
}
