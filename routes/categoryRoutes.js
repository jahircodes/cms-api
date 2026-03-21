const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const validate = require('../middlewares/validator');
const { categoryController } = require('../controllers');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../schemas/categorySchema');

// Public: list and get
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Protected: create, update, delete
router.post(
  '/',
  authenticateToken,
  validate(createCategorySchema, 'body'),
  categoryController.createCategory,
);
router.put(
  '/:id',
  authenticateToken,
  validate(updateCategorySchema, 'body'),
  categoryController.updateCategory,
);
router.delete('/:id', authenticateToken, categoryController.deleteCategory);

module.exports = router;
