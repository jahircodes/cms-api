/**
 * Joi schemas for role-related request validation.
 */
const Joi = require('joi');

const getRolesQuerySchema = Joi.object({
  pageNo: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
}).unknown(false);

module.exports = {
  getRolesQuerySchema,
};
