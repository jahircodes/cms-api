/**
 * Error Handler Middleware
 * ------------------------
 * Centralized error handling for the application.
 * Prevents internal error details from leaking to clients.
 */

const { ApiError } = require('../shared/ApiError');

// eslint-disable-next-line no-unused-vars
const errorHandler = () => (err, req, res, _next) => {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  req.err = err;

  res.status(statusCode).json({
    success: false,
    message,
    code: statusCode,
    requestId: res.locals.requestId,
  });
};

module.exports = { errorHandler };
