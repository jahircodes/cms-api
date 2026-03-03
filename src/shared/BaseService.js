/**
 * Base Service
 * ------------
 * Provides minimal base structure for service classes.
 * Can be extended with common business logic patterns.
 */

const createBaseService = (repository) => ({ repository });

module.exports = { createBaseService };
