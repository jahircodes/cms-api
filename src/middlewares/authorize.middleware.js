/**
 * Authorization Middleware
 * ------------------------
 * Role-based authorization middleware.
 * Checks if authenticated user has required role(s).
 */

const { ApiError } = require('../shared/ApiError');

/**
 * Creates middleware to authorize users by role key.
 * Must be used after authMiddleware.
 * @param {string|string[]} allowedRoles - Single role key or array of role keys
 * @returns {Function} Express middleware
 */
const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError('Authentication required', 401));
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const userRoleKey = req.user.roleKey;

  if (!userRoleKey || !roles.includes(userRoleKey)) {
    return next(new ApiError('Insufficient permissions', 403));
  }

  return next();
};

module.exports = { requireRole };
