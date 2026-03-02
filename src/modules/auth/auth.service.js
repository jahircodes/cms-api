const { hashPassword, comparePassword } = require('../../utils/hash');
const { ApiError } = require('../../shared/ApiError');
const { buildUserTokenPayload, getDefaultTokenSigner } = require('../../utils/token');

const createAuthService = ({ authRepository, signToken = getDefaultTokenSigner() }) => {
  const register = async (payload) => {
    const existing = await authRepository.findByEmail(payload.email);
    if (existing) {
      throw new ApiError('Email already in use', 409);
    }
    const hashed = await hashPassword(payload.password);
    const user = await authRepository.create({
      email: payload.email,
      password: hashed,
    });
    const token = signToken(buildUserTokenPayload(user));
    return { id: user.id, token };
  };

  const login = async (payload) => {
    const user = await authRepository.findByEmail(payload.email);
    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }
    const match = await comparePassword(payload.password, user.password);
    if (!match) {
      throw new ApiError('Invalid credentials', 401);
    }
    const token = signToken(buildUserTokenPayload(user));
    return { id: user.id, token };
  };

  return { register, login };
};

module.exports = { createAuthService };
