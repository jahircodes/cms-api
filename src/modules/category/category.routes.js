const { Router } = require('express');
const { validate, createCategorySchema, updateCategorySchema } = require('./category.validator');
const router = Router();

const buildCategoryRouter = ({ categoryController }) => {
  router.post('/', validate(createCategorySchema), categoryController.createCategory);
  router.get('/', categoryController.getCategories);
  router.get('/:id', categoryController.getCategoryById);
  router.put('/:id', validate(updateCategorySchema), categoryController.updateCategory);
  router.delete('/:id', categoryController.deleteCategory);
  return router;
};

module.exports = { buildCategoryRouter };
