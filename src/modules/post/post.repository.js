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

  return { ...base, findBySlug };
};

module.exports = { createPostRepository };
