const categoryRepository = require('./category.repository');
const slugify = require('../../utils/slugify');

const createCategory = async ({ name, status }) => {
  const category = await categoryRepository.create({
    name,
    status,
    slug: slugify(name),
  });
  return category;
};

const getCategories = async () => {
  return categoryRepository.findMany();
};

const getCategoryById = async (id) => {
  return categoryRepository.findUnique({ id });
};

const updateCategory = async (id, { name, status }) => {
  return categoryRepository.update(id, {
    name,
    status,
    slug: slugify(name),
  });
};

const deleteCategory = async (id) => {
  return categoryRepository.delete(id);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
