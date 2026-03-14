const Joi = require("joi");

/**
 * Universal validator for body, query, or params.
 * @param {Joi.Schema} schema - Joi schema to validate against
 * @param {string} [source] - Optional: "body", "query", or "params"
 */
function validate(schema, source) {
  return (req, res, next) => {
    let actualSource = source;

    // Auto-detect source if not provided
    if (!actualSource) {
      if (req.body && Object.keys(req.body).length > 0) {
        actualSource = "body";
      } else if (req.query && Object.keys(req.query).length > 0) {
        actualSource = "query";
      } else if (req.params && Object.keys(req.params).length > 0) {
        actualSource = "params";
      } else {
        return res.status(400).json({ message: "No data to validate" });
      }
    }

    if (!["body", "query", "params"].includes(actualSource)) {
      return res.status(500).json({ message: "Invalid validator source" });
    }

    const { error } = schema.validate(req[actualSource]);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    next();
  };
}

module.exports = validate;
