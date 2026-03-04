/**
 * Auth Service
 * ------------
 * Handles authentication business logic.
 * Uses dependency injection for decoupling and testability.
 * Does NOT handle HTTP or database access directly.
 */

const { hashPassword, comparePassword } = require('../../utils/hash');
const { ApiError } = require('../../shared/ApiError');
const { buildUserTokenPayload, getDefaultTokenSigner } = require('../../utils/token');

const createAuthService = ({ authRepository, signToken = getDefaultTokenSigner() }) => {
  const register = async ({ email, password }) => {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      // Prevent duplicate accounts
      throw new ApiError('Email already in use', 409);
    }
    const hashed = await hashPassword(password);
    const user = await authRepository.create({
      email,
      password: hashed,
    });
    const token = signToken(buildUserTokenPayload(user));
    return { id: user.id, token };
  };

  const login = async ({ email, password }) => {
    const user = await authRepository.findByEmail(email, {
      include: { role: { select: { roleKey: true } } },
    });
    if (!user) {
      // Prevent user enumeration attack by returning generic error
      throw new ApiError('Invalid credentials', 401);
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      throw new ApiError('Invalid credentials', 401);
    }
    const token = signToken(buildUserTokenPayload(user));
    return { id: user.id, token };
  };

  return { register, login };
};

module.exports = { createAuthService };
