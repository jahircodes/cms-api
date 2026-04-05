/**
 * Joi schemas for user create body and list query parameters.
 */
const Joi = require('joi');

const getUsersQuerySchema = Joi.object({
  pageNo: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
}).unknown(false);

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  roleId: Joi.number().integer().required(),
}).unknown(false);

module.exports = {
  createUserSchema,
  getUsersQuerySchema,
};
