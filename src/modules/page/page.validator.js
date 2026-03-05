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

const searchQuerySchema = Joi.object({
  q: Joi.string().min(1).max(200).optional().allow(''),
  status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'title').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(new ApiError('Validation failed', 400, error.details));
  }
  req.body = value;
  return next();
};

const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(new ApiError('Validation failed', 400, error.details));
  }
  req.query = value;
  return next();
};

module.exports = { validate, validateQuery, createPageSchema, updatePageSchema, searchQuerySchema };
