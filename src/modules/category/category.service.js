/**
 * Category Service
 * ----------------
 * Handles category-related business logic.
 * Uses dependency injection for decoupling and testability.
 * Does NOT handle HTTP or database access directly.
 */

const slugify = require('../../utils/slugify');
const { ApiError } = require('../../shared/ApiError');

const createCategoryService = ({ categoryRepository }) => {
  const createCategory = async ({ name, status }) => {
    const slug = slugify(name);
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      throw new ApiError('Category with this name already exists', 409);
    }
    const category = await categoryRepository.create({
      name,
      slug,
      status: status || 'ACTIVE',
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

  const updateCategory = async (id, { name, status }) => {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new ApiError('Category not found', 404);
    }

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    const category = await categoryRepository.update({ id }, updateData);
    return category;
  };

  const deleteCategory = async (id) => {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new ApiError('Category not found', 404);
    }
    await categoryRepository.delete({ id });
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
