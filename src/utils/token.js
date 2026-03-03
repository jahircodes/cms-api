/**
 * Token Utilities
 * ---------------
 * Provides JWT token creation and payload building.
 * Uses dependency injection for flexible token configuration.
 */

const jwt = require('jsonwebtoken');
const { loadEnv } = require('../config/env');

const createTokenSigner =
  ({ secret, expiresIn }) =>
  (payload) =>
    jwt.sign(payload, secret, { expiresIn });

const buildUserTokenPayload = (user) => ({
  sub: user.id,
  email: user.email,
});

const getDefaultTokenSigner = () => {
  const env = loadEnv();
  return createTokenSigner({ secret: env.JWT_SECRET, expiresIn: env.JWT_EXPIRES_IN });
};

module.exports = { createTokenSigner, buildUserTokenPayload, getDefaultTokenSigner };
