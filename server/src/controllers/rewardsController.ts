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

    let rewards = await Reward.find(query).sort({ tokensRequired: 1 });

    if (rewards.length === 0) {
      console.log('No rewards found, seeding default rewards...');
      await Reward.create([
        {
          title: 'Entrada Festival Cruïlla',
          description: 'Entrada de dia per al Festival Cruïlla 2025. Gaudeix de la millor música en directe.',
          shortDescription: 'Entrada de dia per al Festival Cruïlla',
          longDescription: 'Aconsegueix una entrada de dia per al Festival Cruïlla 2025 al Parc del Fòrum de Barcelona. Podràs triar el dia que prefereixis (dijous, divendres o dissabte) fins a exhaurir existències. Viu l\'experiència Cruïlla amb els teus tokens solidaris.',
          imageUrl: 'https://images.unsplash.com/photo-1459749411177-0473ef716070?auto=format&fit=crop&q=80',
          category: 'festivals',
          tokensRequired: 150,
          status: 'available',
          stockAvailable: 50,
          totalStock: 50,
          validUntil: new Date('2025-07-10'),
          termsAndConditions: ['Vàlid per a una persona', 'No reemborsable', 'Subjecte a disponibilitat'],
          redemptionInstructions: 'Rebràs un codi al teu correu electrònic. Canvia\'l a la web oficial del festival.',
          features: ['Accés al recinte', 'Tots els concerts del dia'],
          restrictions: ['Majors de 16 anys'],
          howToRedeem: ['Bescanvia els tokens', 'Rep el codi', 'Entra a cruillabarcelona.com', 'Introdueix el codi'],
          partnerName: 'Festival Cruïlla'
        },
        {
          title: 'Entrades Cinema Cinesa',
          description: 'Pack de 2 entrades per a qualsevol pel·lícula i sessió als cinemes Cinesa.',
          shortDescription: '2 entrades de cinema',
          longDescription: 'Gaudeix del millor cinema amb qui tu vulguis. Aquest pack inclou 2 entrades vàlides per a qualsevol dia de la setmana a tots els cinemes Cinesa de Catalunya (excepte sales Luxe i esdeveniments especials).',
          imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80',
          category: 'experiences',
          tokensRequired: 80,
          status: 'available',
          stockAvailable: 100,
          totalStock: 100,
          validUntil: new Date('2025-12-31'),
          termsAndConditions: ['No vàlid per sales Luxe', 'Caduca als 6 mesos'],
          redemptionInstructions: 'Presenta el codi QR a la taquilla del cinema.',
          features: ['2 entrades', 'Qualsevol dia'],
          restrictions: ['No inclou crispetes'],
          howToRedeem: ['Bescanvia els tokens', 'Mostra el QR a taquilla'],
          partnerName: 'Cinesa'
        },
        {
          title: 'Targeta Regal Spotify',
          description: '3 mesos de subscripció Premium a Spotify. Música sense anuncis i sense límits.',
          shortDescription: '3 mesos Spotify Premium',
          longDescription: 'Escolta la teva música preferida sense interrupcions. Amb aquesta targeta regal tindràs 3 mesos de Spotify Premium individual. Descàrrega cançons, escolta sense connexió i salta tantes cançons com vulguis.',
          imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80',
          category: 'discounts',
          tokensRequired: 60,
          status: 'available',
          stockAvailable: 200,
          totalStock: 200,
          validUntil: new Date('2026-01-01'),
          termsAndConditions: ['Només per a comptes individuals', 'No acumulable'],
          redemptionInstructions: 'Activa el codi a spotify.com/redeem',
          features: ['Sense anuncis', 'Mode offline'],
          restrictions: ['Comptes nous o existents'],
          howToRedeem: ['Bescanvia els tokens', 'Ves a spotify.com/redeem', 'Introdueix el codi'],
          partnerName: 'Spotify'
        },
        {
          title: 'Sopar per a 2 - Flax & Kale',
          description: 'Menú degustació healthy per a dues persones al restaurant Flax & Kale.',
          shortDescription: 'Sopar healthy per a 2',
          longDescription: 'Descobreix la cuina flexitariana més innovadora de Barcelona. El menú inclou entrants per compartir, plat principal, postres i beguda. Una experiència gastronòmica saludable i deliciosa.',
          imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80',
          category: 'experiences',
          tokensRequired: 120,
          status: 'low_stock',
          stockAvailable: 5,
          totalStock: 20,
          validUntil: new Date('2025-06-30'),
          termsAndConditions: ['Reserva prèvia necessària', 'Subjecte a disponibilitat'],
          redemptionInstructions: 'Truca al restaurant i indica que tens un val de PuntDonació.',
          features: ['Menú complet', 'Beguda inclosa'],
          restrictions: ['No vàlid festius'],
          howToRedeem: ['Bescanvia els tokens', 'Truca per reservar', 'Mostra el codi al restaurant'],
          partnerName: 'Flax & Kale'
        }
      ]);
      rewards = await Reward.find(query).sort({ tokensRequired: 1 });
    }

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
