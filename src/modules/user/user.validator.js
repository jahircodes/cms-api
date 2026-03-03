/**
 * User Validator
 * --------------
 * Defines validation schemas and middleware for user endpoints.
 * Uses Joi for request validation.
 */

const Joi = require('joi');
const { ApiError } = require('../../shared/ApiError');

const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
  }),
  roleId: Joi.number().integer().positive().required().messages({
    'number.base': 'Role ID must be a number',
    'number.positive': 'Role ID must be a positive number',
  }),
});

const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(new ApiError('Validation failed', 400, error.details));
  }
  req.body = value;
  return next();
};

module.exports = { validate, createUserSchema, updateUserSchema };
