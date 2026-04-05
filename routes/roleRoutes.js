const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const validate = require('../middlewares/validator');
const { roleController } = require('../controllers');
const { getRolesQuerySchema } = require('../schemas/roleSchema');

// GET /api/role - Paginated active roles (protected)
router.get(
  '/',
  authenticateToken,
  validate(getRolesQuerySchema, 'query'),
  roleController.getRoles,
);

module.exports = router;
