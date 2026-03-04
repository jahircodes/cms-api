/**
 * Page Repository
 * ---------------
 * Handles database operations for page management.
 * Extends BaseRepository with slug lookup functionality.
 */

const { createBaseRepository } = require('../../shared/BaseRepository');

const createPageRepository = ({ prisma }) => {
  const base = createBaseRepository({ prisma, model: 'page' });

  const findBySlug = (slug, options = {}) => base.findOne({ slug }, options);

  const search = async ({ query, status, page, limit, sortBy, sortOrder }) => {
    const where = {};

    // Build search conditions
    if (query && query.trim()) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Apply filters
    if (status) where.status = status;

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
        },
      }),
      base.count(where),
    ]);

    return { data, total };
  };

  return { ...base, findBySlug, search };
};

module.exports = { createPageRepository };
