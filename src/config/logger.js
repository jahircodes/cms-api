/**
 * Logger Configuration
 * --------------------
 * Configures Pino logger for structured logging.
 * Uses pretty printing in development for readability.
 */

const pino = require('pino');
const { loadEnv } = require('./env');

const env = loadEnv();

const logger = pino({
  level: env.LOG_LEVEL,
  base: undefined,
  serializers: {
    responseTime: () => undefined,
  },
  transport:
    env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
      : undefined,
});

module.exports = { logger };
