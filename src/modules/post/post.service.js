/**
 * Post Service
 * ------------
 * Handles post-related business logic.
 * Uses dependency injection for decoupling and testability.
 * Does NOT handle HTTP or database access directly.
 */

const slugify = require('../../utils/slugify');
const { ApiError } = require('../../shared/ApiError');

const createPostService = ({ postRepository }) => {
  const createPost = async ({ userId, categoryId, title, excerpt, content, image, status }) => {
    const slug = slugify(title);
    const existing = await postRepository.findBySlug(slug);
    if (existing) {
      throw new ApiError('Post with this title already exists', 409);
    }

    const post = await postRepository.create({
      userId,
      categoryId,
      title,
      slug,
      excerpt,
      content,
      image,
      status: status || 'DRAFT',
    });
    return post;
  };

  const getPosts = async () => {
    return postRepository.findMany(
      {},
      {
        include: {
          user: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }
    );
  };

  const getPostById = async (id) => {
    const post = await postRepository.findById(id, {
      include: {
        user: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!post) {
      throw new ApiError('Post not found', 404);
    }
    return post;
  };

  const updatePost = async (id, { title, excerpt, content, image, status, categoryId }) => {
    const existing = await postRepository.findById(id);
    if (!existing) {
      throw new ApiError('Post not found', 404);
    }

    const updateData = {};

    // Only update slug if title is being changed
    if (title !== undefined && title !== existing.title) {
      const slug = slugify(title);
      const existingBySlug = await postRepository.findBySlug(slug);
      if (existingBySlug && existingBySlug.id !== id) {
        throw new ApiError('Post with this title already exists', 409);
      }
      updateData.title = title;
      updateData.slug = slug;
    }

    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const post = await postRepository.update({ id }, updateData);
    return post;
  };

  const deletePost = async (id) => {
    const existing = await postRepository.findById(id);
    if (!existing) {
      throw new ApiError('Post not found', 404);
    }
    await postRepository.delete({ id });
    return { id };
  };

  return {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
  };
};

module.exports = { createPostService };
