import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvConfig {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

export const env: EnvConfig = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: getEnvNumber('PORT', 5000),
  mongodbUri: getEnv('MONGODB_URI', 'mongodb://localhost:27017/puntdonacio'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
  jwtRefreshSecret: getEnv('JWT_REFRESH_SECRET'),
  jwtRefreshExpiresIn: getEnv('JWT_REFRESH_EXPIRES_IN', '30d'),
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:3000'),
  rateLimitWindowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000),
  rateLimitMaxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  isDevelopment: getEnv('NODE_ENV', 'development') === 'development',
  isProduction: getEnv('NODE_ENV', 'development') === 'production',
  isTest: getEnv('NODE_ENV', 'development') === 'test',
};

// Validate required environment variables
if (!env.jwtSecret || env.jwtSecret.includes('change-this')) {
  console.warn('⚠️  WARNING: Using default JWT_SECRET. Change this in production!');
}

if (env.isDevelopment) {
  console.log('📝 Environment configuration loaded:', {
    nodeEnv: env.nodeEnv,
    port: env.port,
    mongodbUri: env.mongodbUri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
    corsOrigin: env.corsOrigin,
  });
}
