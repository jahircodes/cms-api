const { createBaseRepository } = require('../../shared/BaseRepository');

const createUserRepository = ({ prisma }) => createBaseRepository({ prisma, model: 'user' });

module.exports = { createUserRepository };
