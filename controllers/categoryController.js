const {
  createCategoryService,
  getCategoriesService,
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
    console.log(err);
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

/**
 * Lists categories with pagination (query: pageNo, pageSize).
 */
const getCategories = async (req, res, next) => {
  try {
    const { pageNo, pageSize } = req.validatedQuery;
    const result = await getCategoriesService({
      pageNo,
      pageSize,
    });
    res.json({
      success: true,
      data: result.categories,
      pagination: {
        pageNo: result.pageNo,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
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
    console.log(err);
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
