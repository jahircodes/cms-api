/**
 * Auth Middleware
 * ---------------
 * JWT-based authentication middleware.
 * Validates Bearer tokens and attaches user info to request.
 */

const jwt = require('jsonwebtoken');
const { loadEnv } = require('../config/env');
const { ApiError } = require('../shared/ApiError');

const env = loadEnv();

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError('Unauthorized', 401));
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return next(new ApiError('Invalid token', 401));
  }
};

module.exports = { authMiddleware };
