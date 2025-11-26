import mongoose from 'mongoose';
import { env } from './env';

/**
 * Connect to MongoDB database
 */
export async function connectDatabase(): Promise<void> {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`📍 URI: ${env.mongodbUri}`);

    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      family: 4, // Force IPv4
    });

    console.log('✅ MongoDB connected successfully');

    if (env.isDevelopment) {
      console.log(`📊 Database: ${mongoose.connection.name}`);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error; // Re-throw to see the actual error
  }
}

/**
 * Disconnect from MongoDB database
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
}

/**
 * Handle MongoDB connection events
 */
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});
