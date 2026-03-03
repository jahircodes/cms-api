/**
 * ApiError
 * --------
 * Custom error class for operational errors.
 * Used for predictable error handling across the application.
 */

class ApiError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = { ApiError };
