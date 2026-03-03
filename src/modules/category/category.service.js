const slugify = require('../../utils/slugify');
const { ApiError } = require('../../shared/ApiError');

const createCategoryService = ({ categoryRepository }) => {
  const createCategory = async (payload) => {
    const slug = slugify(payload.name);
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      throw new ApiError('Category with this name already exists', 409);
    }
    const category = await categoryRepository.create({
      name: payload.name,
      slug,
      status: payload.status || 'ACTIVE',
    });
    return category;
  };

  const getCategories = async () => {
    return categoryRepository.findMany();
  };

  const getCategoryById = async (id) => {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new ApiError('Category not found', 404);
    }
    return category;
  };

  const updateCategory = async (id, payload) => {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new ApiError('Category not found', 404);
    }
    const slug = slugify(payload.name);
    const category = await categoryRepository.update(id, {
      name: payload.name,
      slug,
      status: payload.status,
    });
    return category;
  };

  const deleteCategory = async (id) => {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new ApiError('Category not found', 404);
    }
    await categoryRepository.delete(id);
    return { id };
  };

  return {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
  };
};

module.exports = { createCategoryService };
