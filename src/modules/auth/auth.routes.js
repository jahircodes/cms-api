const { Router } = require('express');
const { validate, registerSchema, loginSchema } = require('./auth.validator');

const buildAuthRouter = ({ authController }) => {
  const router = Router();

  router.post('/register', validate(registerSchema), authController.register);
  router.post('/login', validate(loginSchema), authController.login);

  return router;
};

module.exports = { buildAuthRouter };
