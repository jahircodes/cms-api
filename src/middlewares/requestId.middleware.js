const { randomUUID } = require('crypto');

const requestIdMiddleware = (req, res, next) => {
  const id = randomUUID();
  req.id = id;
  res.locals.requestId = id;
  res.setHeader('x-request-id', id);
  next();
};

module.exports = { requestIdMiddleware };
