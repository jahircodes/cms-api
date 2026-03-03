/**
 * Role Validator
 * --------------
 * Defines validation schemas and middleware for role endpoints.
 * Uses Joi for request validation.
 */

const Joi = require('joi');
const { ApiError } = require('../../shared/ApiError');

const createRoleSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  roleKey: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[A-Z_]+$/)
    .required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
});

const updateRoleSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  roleKey: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[A-Z_]+$/)
    .optional(),
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

module.exports = { validate, createRoleSchema, updateRoleSchema };
