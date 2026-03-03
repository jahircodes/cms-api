/**
 * User Router
 * -----------
 * Defines user management routes with validation middleware.
 * No business or database logic here.
 */

const { Router } = require('express');
const { validate, createUserSchema, updateUserSchema } = require('./user.validator');

const buildUserRouter = ({ userController }) => {
  const router = Router();

  router.post('/', validate(createUserSchema), userController.createUser);
  router.get('/', userController.getUsers);
  router.get('/:id', userController.getUser);
  router.patch('/:id', validate(updateUserSchema), userController.updateUser);
  router.delete('/:id', userController.deleteUser);

  return router;
};

module.exports = { buildUserRouter };
