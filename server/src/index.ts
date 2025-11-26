import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

console.log('\n✅ All modules loaded successfully\n');

/**
 * Start the server
 */
async function startServer() {
  console.log('🚀 Starting server function...');

  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start listening
    app.listen(env.port, () => {
      console.log(`\n🚀 Server started successfully!`);
      console.log(`📍 Environment: ${env.nodeEnv}`);
      console.log(`🌐 API URL: http://localhost:${env.port}`);
      console.log(`🏥 Health check: http://localhost:${env.port}/api/health`);
      console.log(`📡 CORS origin: ${env.corsOrigin}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();
