/**
 * Rate Limit Middleware
 * ---------------------
 * Protects API endpoints from abuse and DDoS attacks.
 * Configured via environment variables.
 */

const rateLimit = require('express-rate-limit');
const { loadEnv } = require('../config/env');

const env = loadEnv();

const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { rateLimiter };
