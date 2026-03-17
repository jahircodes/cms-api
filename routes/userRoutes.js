const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const userSchema = require('../schemas/userSchema');
const validate = require('../middlewares/validator');

// GET /api/user - Get all users
router.get('/', userController.getUsers);

// POST /api/user - Create user with validation
router.post('/', validate(userSchema, 'body'), userController.createUser);

module.exports = router;
