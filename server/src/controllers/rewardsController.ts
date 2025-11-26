import { Request, Response, NextFunction } from 'express';
import { Reward, RewardTransaction, User } from '../models';
import { sendSuccess } from '../utils/response';
import { AuthenticationError, NotFoundError, ValidationError } from '../utils/errors';

/**
 * Get all rewards
 */
export async function getRewards(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category } = req.query;
    const query: Record<string, unknown> = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    // Only show available and low_stock rewards
    query.status = { $in: ['available', 'low_stock'] };

    const rewards = await Reward.find(query).sort({ tokensRequired: 1 });

    sendSuccess(res, rewards);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific reward
 */
export async function getReward(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reward = await Reward.findById(req.params.id);

    if (!reward) {
      throw new NotFoundError('Reward not found');
    }

    sendSuccess(res, reward);
  } catch (error) {
    next(error);
  }
}

/**
 * Redeem a reward
 */
export async function redeemReward(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const { rewardId } = req.body;

    // Get user and reward
    const [user, reward] = await Promise.all([
      User.findById(req.user.userId),
      Reward.findById(rewardId),
    ]);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!reward) {
      throw new NotFoundError('Reward not found');
    }

    // Check if reward is available
    if (reward.status !== 'available' && reward.status !== 'low_stock') {
      throw new ValidationError('Reward is not available', 'rewardId');
    }

    // Check if user has enough tokens
    if (user.tokens < reward.tokensRequired) {
      throw new ValidationError('Insufficient tokens', 'tokens');
    }

    // Check stock
    if (reward.stockAvailable !== undefined && reward.stockAvailable <= 0) {
      throw new ValidationError('Reward is out of stock', 'rewardId');
    }

    // Create transaction
    const transaction = new RewardTransaction({
      userId: user._id,
      rewardId: reward._id,
      tokensSpent: reward.tokensRequired,
      status: 'confirmed',
    });

    await transaction.save();

    // Deduct tokens from user
    user.tokens -= reward.tokensRequired;
    await user.save();

    // Update reward stock
    if (reward.stockAvailable !== undefined) {
      reward.stockAvailable--;
      if (reward.stockAvailable === 0) {
        reward.status = 'out_of_stock';
      } else if (reward.stockAvailable <= 5) {
        reward.status = 'low_stock';
      }
      await reward.save();
    }

    // Populate reward data in transaction
    await transaction.populate('rewardId');

    sendSuccess(
      res,
      {
        success: true,
        transaction,
        message: 'Reward redeemed successfully',
      },
      200,
      'Reward redeemed'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's reward transactions
 */
export async function getUserRewards(
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

    const transactions = await RewardTransaction.find({ userId: req.user.userId })
      .populate('rewardId')
      .sort({ createdAt: -1 })
      .limit(50);

    sendSuccess(res, {
      availableTokens: user.tokens,
      transactions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific reward transaction
 */
export async function getRewardTransaction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const transaction = await RewardTransaction.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).populate('rewardId');

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    sendSuccess(res, transaction);
  } catch (error) {
    next(error);
  }
}

/**
 * Cancel a reward transaction
 */
export async function cancelRewardTransaction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const transaction = await RewardTransaction.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    if (transaction.status !== 'pending' && transaction.status !== 'confirmed') {
      throw new ValidationError('Cannot cancel this transaction', 'status');
    }

    // Refund tokens to user
    const user = await User.findById(req.user.userId);
    if (user) {
      user.tokens += transaction.tokensSpent;
      await user.save();
    }

    // Update transaction status
    transaction.status = 'cancelled';
    await transaction.save();

    sendSuccess(res, transaction, 200, 'Transaction cancelled');
  } catch (error) {
    next(error);
  }
}
