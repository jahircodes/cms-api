const { sendSuccess } = require('../../utils/response');

const buildAuthController = ({ authService }) => {
  const register = async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, result, 'Registered');
    } catch (err) {
      next(err);
    }
  };

  const login = async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, result, 'Logged in');
    } catch (err) {
      next(err);
    }
  };

  return { register, login };
};

module.exports = { buildAuthController };
