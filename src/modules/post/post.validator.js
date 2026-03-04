/**
 * Post Validator
 * --------------
 * Defines validation schemas and middleware for post endpoints.
 * Uses Joi for request validation.
 */

const Joi = require('joi');
const { ApiError } = require('../../shared/ApiError');

const createPostSchema = Joi.object({
  categoryId: Joi.number().integer().positive().required(),
  title: Joi.string().min(2).max(200).required(),
  excerpt: Joi.string().max(500).optional(),
  content: Joi.string().required(),
  image: Joi.string().uri().optional(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
});

const updatePostSchema = Joi.object({
  categoryId: Joi.number().integer().positive().optional(),
  title: Joi.string().min(2).max(200).optional(),
  excerpt: Joi.string().max(500).optional(),
  content: Joi.string().optional(),
  image: Joi.string().uri().optional(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
});

const searchQuerySchema = Joi.object({
  q: Joi.string().min(1).max(200).optional().allow(''),
  status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
  categoryId: Joi.number().integer().positive().optional(),
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

module.exports = { validate, validateQuery, createPostSchema, updatePostSchema, searchQuerySchema };
