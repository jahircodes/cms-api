/**
 * Auth Controller
 * ---------------
 * Handles HTTP logic for authentication endpoints.
 * Uses dependency injection for testability and decoupling.
 */

const { sendSuccess } = require('../../utils/response');

const buildAuthController = ({ authService }) => {
  const register = async (req, res, next) => {
    try {
      const data = req.body;
      const result = await authService.register(data);
      return sendSuccess(res, result, 'Registered');
    } catch (err) {
      next(err);
    }
  };

  const login = async (req, res, next) => {
    try {
      const data = req.body;
      const result = await authService.login(data);
      return sendSuccess(res, result, 'Logged in');
    } catch (err) {
      next(err);
    }
  };

  return { register, login };
};

module.exports = { buildAuthController };
