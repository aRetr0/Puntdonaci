import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/usersRoutes';
import appointmentsRoutes from './routes/appointmentsRoutes';
import donationCentersRoutes from './routes/donationCentersRoutes';
import donationTypesRoutes from './routes/donationTypesRoutes';
import donationsRoutes from './routes/donationsRoutes';
import campaignsRoutes from './routes/campaignsRoutes';
import rewardsRoutes from './routes/rewardsRoutes';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMaxRequests,
    message: 'Too many requests from this IP, please try again later',
  });
  app.use('/api', limiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Logging middleware
  if (env.isDevelopment) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.nodeEnv,
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/appointments', appointmentsRoutes);
  app.use('/api/donation-centers', donationCentersRoutes);
  app.use('/api/donation-types', donationTypesRoutes);
  app.use('/api/donations', donationsRoutes);
  app.use('/api/campaigns', campaignsRoutes);
  app.use('/api/rewards', rewardsRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}