/**
 * User Repository
 * ---------------
 * Handles database operations for user management.
 * Uses BaseRepository for standard CRUD operations.
 */

const { createBaseRepository } = require('../../shared/BaseRepository');

const createUserRepository = ({ prisma }) => createBaseRepository({ prisma, model: 'user' });

module.exports = { createUserRepository };
