const { Router } = require('express');
const { validate, updateUserSchema } = require('./user.validator');

const buildUserRouter = ({ userController }) => {
  const router = Router();

  router.get('/', userController.getUsers);
  router.get('/:id', userController.getUser);
  router.patch('/:id', validate(updateUserSchema), userController.updateUser);
  router.delete('/:id', userController.deleteUser);

  return router;
};

module.exports = { buildUserRouter };
