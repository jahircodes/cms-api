/**
 * Page Validator
 * --------------
 * Defines validation schemas and middleware for page endpoints.
 * Uses Joi for request validation.
 */

const Joi = require('joi');
const { ApiError } = require('../../shared/ApiError');

const createPageSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  content: Joi.string().required(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
});

const updatePageSchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  content: Joi.string().optional(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(new ApiError('Validation failed', 400, error.details));
  }
  req.body = value;
  return next();
};

module.exports = { validate, createPageSchema, updatePageSchema };
