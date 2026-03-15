const express = require('express');
const router = express.Router();
const { getRoles } = require('../controllers/roleController');
const authenticateToken = require('../middlewares/authenticateToken');

// GET /api/role - Get all roles (protected route)
router.get('/', authenticateToken, getRoles);

module.exports = router;
