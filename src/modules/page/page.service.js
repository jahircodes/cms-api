/**
 * Page Service
 * ------------
 * Handles page-related business logic.
 * Uses dependency injection for decoupling and testability.
 * Does NOT handle HTTP or database access directly.
 */

const slugify = require('../../utils/slugify');
const { ApiError } = require('../../shared/ApiError');

const createPageService = ({ pageRepository }) => {
  const createPage = async ({ userId, title, content, status }) => {
    const slug = slugify(title);
    const existing = await pageRepository.findBySlug(slug);
    if (existing) {
      throw new ApiError('Page with this title already exists', 409);
    }

    const page = await pageRepository.create({
      userId,
      title,
      slug,
      content,
      status: status || 'DRAFT',
    });
    return page;
  };

  const getPages = async () => {
    return pageRepository.findMany(
      {},
      {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }
    );
  };

  const getPageById = async (id) => {
    const page = await pageRepository.findById(id, {
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!page) {
      throw new ApiError('Page not found', 404);
    }
    return page;
  };

  const updatePage = async (id, { title, content, status }) => {
    const existing = await pageRepository.findById(id);
    if (!existing) {
      throw new ApiError('Page not found', 404);
    }

    const updateData = {
      content,
      status,
    };

    // Only update slug if title is being changed
    if (title && title !== existing.title) {
      const slug = slugify(title);
      const existingBySlug = await pageRepository.findBySlug(slug);
      if (existingBySlug && existingBySlug.id !== id) {
        throw new ApiError('Page with this title already exists', 409);
      }
      updateData.title = title;
      updateData.slug = slug;
    }

    const page = await pageRepository.update({ id }, updateData);
    return page;
  };

  const deletePage = async (id) => {
    const existing = await pageRepository.findById(id);
    if (!existing) {
      throw new ApiError('Page not found', 404);
    }
    await pageRepository.delete({ id });
    return { id };
  };

  return {
    createPage,
    getPages,
    getPageById,
    updatePage,
    deletePage,
  };
};

module.exports = { createPageService };
