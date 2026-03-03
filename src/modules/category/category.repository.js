const { createBaseRepository } = require('../../shared/BaseRepository');

const createCategoryRepository = ({ prisma }) => {
  const base = createBaseRepository({ prisma, model: 'category' });

  const findBySlug = (slug, options = {}) => base.findOne({ slug }, options);

  return { ...base, findBySlug };
};

module.exports = { createCategoryRepository };
