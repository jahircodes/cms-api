const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const {
  createUserSchema,
  getUsersQuerySchema,
} = require('../schemas/userSchema');
const validate = require('../middlewares/validator');
const authenticateToken = require('../middlewares/authenticateToken');
const changePasswordSchema = require('../schemas/changePasswordSchema');
const userPasswordSchema = require('../schemas/userPasswordSchema');

// GET /api/user - Paginated users
router.get(
  '/',
  validate(getUsersQuerySchema, 'query'),
  userController.getUsers,
);

// POST /api/user - Create user with validation
router.post('/', validate(createUserSchema, 'body'), userController.createUser);

// PUT /api/user/:userId/password - Change user's password
router.put(
  '/:userId/change-password',
  authenticateToken,
  validate(changePasswordSchema, 'body'),
  userController.changePassword,
);

// PUT /api/user/:userId - Update user status and author profile (self or admin)
router.put('/:userId', authenticateToken, userController.updateUser);

// DELETE /api/user/:userId - Delete a user (self or admin)
router.delete('/:userId', authenticateToken, userController.deleteUser);

// GET /api/user/me - Logged-in user profile
router.get('/me', authenticateToken, userController.getLoggedInUser);

// PUT /api/user/me/password - Logged-in user changes password (current + new)
router.put(
  '/me/password',
  authenticateToken,
  validate(userPasswordSchema, 'body'),
  userController.updateLoggedInUserPassword,
);

module.exports = router;
