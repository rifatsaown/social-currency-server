import app from './app';
import config from './app/config';
import logger from './app/utils/logger';
import dbConnect from './app/utils/dbConnect';
import { Server } from 'http';

let server: Server;

(async () => {
  try {
    // Connect to MongoDB
    dbConnect();
    // Start the server
    server = app.listen(config.port, () => {
      logger.info(`🌐 Server running on port ${config.port} 🔥`);
    });
  } catch (error) {
    logger.error(error);
  }
})();

// Handle unhandled rejection
process.on('unhandledRejection', (error) => {
  logger.error(`🛑 Unhandled Rejection: ${error} , Shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`🛑 Uncaught Exception: ${error} , Shutting down...`);
  process.exit(1);
});