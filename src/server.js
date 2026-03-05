/**
 * Server Entry Point
 * ------------------
 * Starts HTTP server and handles process-level errors.
 * Gracefully handles uncaught exceptions and promise rejections.
 */

const http = require('http');
const { app } = require('./app');
const { loadEnv } = require('./config/env');
const { logger } = require('./config/logger');

const env = loadEnv();
const PORT = env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error({ err }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
  process.exit(1);
});
