/**
 * Request ID Middleware
 * ---------------------
 * Attaches unique request ID for tracing and logging.
 * Helps track requests across distributed systems.
 */

const { randomUUID } = require('crypto');

const requestIdMiddleware = (req, res, next) => {
  const id = randomUUID();
  req.id = id;
  res.locals.requestId = id;
  res.setHeader('x-request-id', id);
  next();
};

module.exports = { requestIdMiddleware };
