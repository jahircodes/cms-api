/**
 * Post Repository
 * ---------------
 * Handles database operations for post management.
 * Extends BaseRepository with slug lookup functionality.
 */

const { createBaseRepository } = require('../../shared/BaseRepository');

const createPostRepository = ({ prisma }) => {
  const base = createBaseRepository({ prisma, model: 'post' });

  const findBySlug = (slug, options = {}) => base.findOne({ slug }, options);

  const search = async ({ query, status, categoryId, page, limit, sortBy, sortOrder }) => {
    const where = {};

    // Build search conditions
    if (query && query.trim()) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Apply filters
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query and count in parallel
    const [data, total] = await Promise.all([
      base.findMany(where, {
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      base.count(where),
    ]);

    return { data, total };
  };

  const findScheduledPostsToPublish = () => {
    return base.findMany(
      {
        status: 'SCHEDULED',
        publishedAt: {
          lte: new Date(),
        },
      },
      {
        include: {
          user: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }
    );
  };

  return { ...base, findBySlug, search, findScheduledPostsToPublish };
};

module.exports = { createPostRepository };
