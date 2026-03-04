/**
 * User Router
 * -----------
 * Defines user management routes with validation middleware.
 * No business or database logic here.
 */

const { Router } = require('express');
const { requireRole } = require('../../middlewares/authorize.middleware');
const {
  validate,
  adminCreateUserSchema,
  updateUserSchema,
  changePasswordSchema,
} = require('./user.validator');

const buildUserRouter = ({ userController }) => {
  const router = Router();

  router.post(
    '/admin/create',
    requireRole('ADMIN'),
    validate(adminCreateUserSchema),
    userController.adminCreateUser
  );
  router.patch('/change-password', validate(changePasswordSchema), userController.changePassword);
  router.get('/', userController.getUsers);
  router.get('/:id', userController.getUser);
  router.patch('/:id', validate(updateUserSchema), userController.updateUser);
  router.delete('/:id', userController.deleteUser);

  return router;
};

module.exports = { buildUserRouter };
