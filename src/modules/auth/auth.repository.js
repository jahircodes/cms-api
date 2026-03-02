const { createBaseRepository } = require('../../shared/BaseRepository');

const createAuthRepository = ({ prisma }) => {
  const base = createBaseRepository({ prisma, model: 'user' });

  const findByEmail = (email, options = {}) => base.findOne({ email }, options);

  return { ...base, findByEmail };
};

module.exports = { createAuthRepository };
