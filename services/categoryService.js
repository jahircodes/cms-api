const { Category } = require('../models');

const createCategoryService = async ({
  name,
  slug,
  parentId,
  description,
  status,
}) => {
  const existing = await Category.findOne({ where: { slug } });
  if (existing) {
    const error = new Error('Slug already in use');
    error.statusCode = 409;
    throw error;
  }

  await Category.create({
    name,
    slug,
    parentId,
    description,
    status: status ?? true,
  });

  return { message: 'Category created successfully' };
};

const getAllCategoriesService = async () => {
  return await Category.findAll({
    attributes: ['id', 'name', 'slug', 'parentId', 'description', 'status'],
  });
};

const getCategoryByIdService = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }
  return category;
};

const updateCategoryService = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  // prevent slug collisions
  if (data.slug) {
    const existing = await Category.findOne({
      where: { slug: data.slug, id: { [Category.sequelize.Op.ne]: id } },
    });
    if (existing) {
      const error = new Error('Slug already in use');
      error.statusCode = 409;
      throw error;
    }
  }

  await category.update(data);
  return { message: 'Category updated successfully' };
};

const deleteCategoryService = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  await category.destroy();
  return { message: 'Category deleted successfully' };
};

module.exports = {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
};
