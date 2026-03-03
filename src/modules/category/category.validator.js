/**
 * Category Validator
 * ------------------
 * Defines validation schemas and middleware for category endpoints.
 * Uses Joi for request validation.
 */

const Joi = require('joi');
const { ApiError } = require('../../shared/ApiError');

const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(new ApiError('Validation failed', 400, error.details));
  }
  req.body = value;
  return next();
};

module.exports = { validate, createCategorySchema, updateCategorySchema };
