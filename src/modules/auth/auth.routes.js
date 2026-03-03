const { Router } = require('express');
const { validate, registerSchema, loginSchema } = require('./auth.validator');
const router = Router();

const buildAuthRouter = ({ authController }) => {
  router.post('/register', validate(registerSchema), authController.register);
  router.post('/login', validate(loginSchema), authController.login);

  return router;
};

module.exports = { buildAuthRouter };
