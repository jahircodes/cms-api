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
  const createPost = async ({
    userId,
    categoryId,
    title,
    excerpt,
    content,
    image,
    status,
    publishedAt,
  }) => {
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
      publishedAt: publishedAt ? new Date(publishedAt) : null,
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

  const updatePost = async (
    id,
    { title, excerpt, content, image, status, categoryId, publishedAt }
  ) => {
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
    if (publishedAt !== undefined)
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;

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

  const searchPosts = async ({ query, status, categoryId, page, limit, sortBy, sortOrder }) => {
    const { data, total } = await postRepository.search({
      query,
      status,
      categoryId,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  };

  const publishScheduledPosts = async () => {
    const scheduledPosts = await postRepository.findScheduledPostsToPublish();

    const publishedPosts = [];

    for (const post of scheduledPosts) {
      try {
        const updated = await postRepository.update({ id: post.id }, { status: 'PUBLISHED' });
        publishedPosts.push(updated);
      } catch (error) {
        // Log error but continue processing other posts
        console.error(`Failed to publish post ${post.id}:`, error.message);
      }
    }

    return {
      count: publishedPosts.length,
      posts: publishedPosts,
    };
  };

  return {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    searchPosts,
    publishScheduledPosts,
  };
};

module.exports = { createPostService };
