import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { generateTokens } from '../utils/jwt';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticationError, ConflictError, ValidationError } from '../utils/errors';

/**
 * Register a new user
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name, phone, birthdate, gender, bloodType, hasDonatedBefore } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ConflictError('Email already registered', 'email');
    }

    // Validate age (must be 18-65)
    const birthDate = new Date(birthdate);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) {
      throw new ValidationError('Must be at least 18 years old', 'birthdate');
    }
    if (age > 65) {
      throw new ValidationError('Must be 65 years old or younger', 'birthdate');
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      phone,
      birthdate: birthDate,
      gender,
      bloodType,
      hasDonatedBefore,
      tokens: hasDonatedBefore ? 15 : 0, // Bonus tokens for experienced donors
      donationCount: 0,
      livesSaved: 0,
    });

    await user.save();

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
    });

    // Return user and token
    sendCreated(
      res,
      {
        user,
        token: tokens.accessToken,
      },
      'Registration successful'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
    });

    // Return user and token
    sendSuccess(res, {
      user,
      token: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user
 */
export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user (client-side token removal)
 */
export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, { message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: req.user.userId,
      email: req.user.email,
    });

    sendSuccess(res, {
      token: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
}
