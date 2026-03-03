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

  return { ...base, findBySlug };
};

module.exports = { createPageRepository };
