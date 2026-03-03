/**
 * Role Repository
 * ---------------
 * Handles database operations for role management.
 * Extends BaseRepository with roleKey lookup functionality.
 */

const { createBaseRepository } = require('../../shared/BaseRepository');

const createRoleRepository = ({ prisma }) => {
  const base = createBaseRepository({ prisma, model: 'role' });

  const findByRoleKey = (roleKey, options = {}) => base.findOne({ roleKey }, options);

  return { ...base, findByRoleKey };
};

module.exports = { createRoleRepository };
