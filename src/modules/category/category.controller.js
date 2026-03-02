const categoryService = require('./category.service');
const { validateCategory } = require('./category.validator');
const ApiError = require('../../shared/ApiError');

const createCategory = async (req, res, next) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) throw new ApiError(400, error.details[0].message);
    const { name, status } = req.body;
    const category = await categoryService.createCategory({ name, status });
    res.status(201).json({ data: category });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(+req.params.id);
    if (!category) throw new ApiError(404, 'Category not found');
    res.json({ data: category });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) throw new ApiError(400, error.details[0].message);
    const { name, status } = req.body;
    const category = await categoryService.updateCategory(+req.params.id, { name, status });
    if (!category) throw new ApiError(404, 'Category not found');
    res.json({ data: category });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const deleted = await categoryService.deleteCategory(+req.params.id);
    if (!deleted) throw new ApiError(404, 'Category not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
