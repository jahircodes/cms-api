/**
 * Auth Router
 * -----------
 * Defines authentication routes with validation middleware.
 * No business or database logic here.
 * Note: User registration is admin-managed via POST /api/users
 */

const { Router } = require('express');
const { validate, loginSchema } = require('./auth.validator');
const router = Router();

const buildAuthRouter = ({ authController }) => {
  router.post('/login', validate(loginSchema), authController.login);

  return router;
};

module.exports = { buildAuthRouter };
