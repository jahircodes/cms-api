/**
 * Joi schemas for category create/update bodies and list query parameters.
 */
const Joi = require('joi');

const getCategoriesQuerySchema = Joi.object({
  pageNo: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
}).unknown(false);

const createCategorySchema = Joi.object({
  name: Joi.string().max(150).required(),
  slug: Joi.string().max(180).required(),
  parentId: Joi.number().integer().allow(null),
  description: Joi.string().allow('', null),
  status: Joi.boolean().optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().max(150).optional(),
  slug: Joi.string().max(180).optional(),
  parentId: Joi.number().integer().allow(null),
  description: Joi.string().allow('', null),
  status: Joi.boolean().optional(),
});

module.exports = {
  getCategoriesQuerySchema,
  createCategorySchema,
  updateCategorySchema,
};
