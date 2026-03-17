const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { roleController } = require('../controllers');

// GET /api/role - Get all roles (protected route)
router.get('/', authenticateToken, roleController.getRoles);

module.exports = router;
