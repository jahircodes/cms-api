const {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} = require('../services/categoryService');

const createCategory = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await createCategoryService(payload);
    res.status(201).json({ success: true, message: result.message });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesService();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await getCategoryByIdService(id);
    res.json({ success: true, data: category });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await updateCategoryService(id, payload);
    res.json({ success: true, message: result.message });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }

    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteCategoryService(id);
    res.json({ success: true, message: result.message });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
