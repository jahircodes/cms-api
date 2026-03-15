const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');

// GET /api/user - Get all users
router.get('/', getUsers);

module.exports = router;
