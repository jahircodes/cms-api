/**
 * User Role Constants
 * -------------------
 * Centralized role definitions for authorization.
 * Prevents magic strings and ensures consistency across the application.
 * Must match roleKey values in the database.
 */

const USER_ROLES = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  AUTHOR: 'AUTHOR',
  SUBSCRIBER: 'SUBSCRIBER',
};

module.exports = { USER_ROLES };
