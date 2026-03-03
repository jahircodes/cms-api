const { sendSuccess } = require('../../utils/response');

const buildCategoryController = ({ categoryService }) => {
  const createCategory = async (req, res, next) => {
    try {
      const result = await categoryService.createCategory(req.body);
      return sendSuccess(res, result, 'Category created');
    } catch (err) {
      next(err);
    }
  };

  const getCategories = async (req, res, next) => {
    try {
      const result = await categoryService.getCategories();
      return sendSuccess(res, result, 'Categories retrieved');
    } catch (err) {
      next(err);
    }
  };

  const getCategoryById = async (req, res, next) => {
    try {
      const result = await categoryService.getCategoryById(+req.params.id);
      return sendSuccess(res, result, 'Category retrieved');
    } catch (err) {
      next(err);
    }
  };

  const updateCategory = async (req, res, next) => {
    try {
      const result = await categoryService.updateCategory(+req.params.id, req.body);
      return sendSuccess(res, result, 'Category updated');
    } catch (err) {
      next(err);
    }
  };

  const deleteCategory = async (req, res, next) => {
    try {
      const result = await categoryService.deleteCategory(+req.params.id);
      return sendSuccess(res, result, 'Category deleted');
    } catch (err) {
      next(err);
    }
  };

  return {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
  };
};

module.exports = { buildCategoryController };
