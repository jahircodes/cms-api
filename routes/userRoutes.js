const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const userSchema = require('../schemas/userSchema');
const validate = require('../middlewares/validator');
const authenticateToken = require('../middlewares/authenticateToken');
const changePasswordSchema = require('../schemas/changePasswordSchema');

// GET /api/user - Get all users
router.get('/', userController.getUsers);

// POST /api/user - Create user with validation
router.post('/', validate(userSchema, 'body'), userController.createUser);

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

//get logged in user details
router.get('/me', authenticateToken, userController.getLoggedInUser);

module.exports = router;
