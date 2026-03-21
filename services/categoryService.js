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
    throw new Error('Slug already in use');
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
  if (!category) throw new Error('Category not found');
  return category;
};

const updateCategoryService = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error('Category not found');

  // prevent slug collisions
  if (data.slug) {
    const existing = await Category.findOne({
      where: { slug: data.slug, id: { [Category.sequelize.Op.ne]: id } },
    });
    if (existing) throw new Error('Slug already in use');
  }

  await category.update(data);
  return { message: 'Category updated successfully' };
};

const deleteCategoryService = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error('Category not found');

  await category.destroy();
  return { message: 'Category deleted' };
};

module.exports = {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
};
