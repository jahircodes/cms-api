const Joi = require('joi');

/**
 * Universal validator for body, query, or params.
 * For source "query", read results from req.validatedQuery (Express 5: req.query is read-only).
 * @param {Joi.Schema} schema - Joi schema to validate against
 * @param {string} [source] - Optional: "body", "query", or "params"
 */
function validate(schema, source) {
  return (req, res, next) => {
    let actualSource = source;

    // Auto-detect source if not provided
    if (!actualSource) {
      if (req.body && Object.keys(req.body).length > 0) {
        actualSource = 'body';
      } else if (req.query && Object.keys(req.query).length > 0) {
        actualSource = 'query';
      } else if (req.params && Object.keys(req.params).length > 0) {
        actualSource = 'params';
      } else {
        return res
          .status(400)
          .json({ success: false, message: 'No data to validate' });
      }
    }

    if (!['body', 'query', 'params'].includes(actualSource)) {
      return res
        .status(500)
        .json({ success: false, message: 'Invalid validator source' });
    }

    const { error, value } = schema.validate(req[actualSource], {
      stripUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Express 5: req.query is read-only; assign coerced defaults on validatedQuery.
    if (actualSource === 'query') {
      req.validatedQuery = value;
    } else {
      req[actualSource] = value;
    }
    next();
  };
}

module.exports = validate;
